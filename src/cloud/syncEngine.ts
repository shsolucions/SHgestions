// ============================================
// Sync Engine — Motor de sincronització
// ============================================

import { db } from '@/db/database';
import { cloudService } from './cloudService';
import type {
  SyncQueueItem,
  SyncConflict,
  SyncStats,
  SyncItemStatus,
  SyncEntityType,
} from './types';
import type { Loan, PaymentRecord, Attachment } from '@/types';

const SYNC_QUEUE_KEY = 'SHgestions_sync_queue';
const SYNC_CONFLICTS_KEY = 'SHgestions_sync_conflicts';
const MAX_RETRIES = 3;

// ─── Queue Management ───────────────────────────

function loadQueue(): SyncQueueItem[] {
  const raw = localStorage.getItem(SYNC_QUEUE_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

function saveQueue(queue: SyncQueueItem[]): void {
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
}

function loadConflicts(): SyncConflict[] {
  const raw = localStorage.getItem(SYNC_CONFLICTS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

function saveConflicts(conflicts: SyncConflict[]): void {
  localStorage.setItem(SYNC_CONFLICTS_KEY, JSON.stringify(conflicts));
}

// ─── Public API ─────────────────────────────────

export const syncEngine = {
  /**
   * Afegeix un element a la cua de sincronització.
   * Es crida automàticament quan es crea/edita/esborra una entitat.
   */
  enqueue(entityType: SyncEntityType, entityId: string): void {
    const queue = loadQueue();

    // No duplicar entrades pendents
    const existing = queue.find(
      q => q.entityType === entityType && q.entityId === entityId && q.status === 'pending'
    );
    if (existing) return;

    const item: SyncQueueItem = {
      id: crypto.randomUUID(),
      entityType,
      entityId,
      direction: 'push',
      status: 'pending',
      retryCount: 0,
      maxRetries: MAX_RETRIES,
      errorMessage: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    queue.push(item);
    saveQueue(queue);
  },

  /**
   * Executa la sincronització completa:
   * 1. Push de tots els elements pendents
   * 2. Pull de canvis remots (si n'hi ha)
   */
  async syncAll(): Promise<{
    success: boolean;
    pushed: number;
    pulled: number;
    errors: number;
    message: string;
  }> {
    const provider = cloudService.getActiveProvider();
    if (!provider) {
      return { success: false, pushed: 0, pulled: 0, errors: 0, message: 'Cap proveïdor connectat.' };
    }

    const connected = await provider.isConnected();
    if (!connected) {
      return { success: false, pushed: 0, pulled: 0, errors: 0, message: 'Proveïdor no connectat. Cal reconnectar.' };
    }

    let pushed = 0;
    let pulled = 0;
    let errors = 0;

    try {
      // Ensure folder structure exists
      await provider.ensureFolderStructure();

      // ── PUSH: enviar dades locals al núvol ──

      // 1. Push all loans
      const loans = await db.loans.toArray();
      for (const loan of loans) {
        try {
          await provider.uploadJson(`prestecs/loan-${loan.id}.json`, loan);
          this.markSynced('loan', loan.id);
          pushed++;
        } catch (err) {
          this.markError('loan', loan.id, err instanceof Error ? err.message : 'Error desconegut');
          errors++;
        }
      }

      // 2. Push all payment records
      const payments = await db.paymentRecords.toArray();
      for (const payment of payments) {
        try {
          await provider.uploadJson(`prestecs/payment-${payment.id}.json`, payment);
          this.markSynced('paymentRecord', payment.id);
          pushed++;
        } catch (err) {
          this.markError('paymentRecord', payment.id, err instanceof Error ? err.message : 'Error desconegut');
          errors++;
        }
      }

      // 3. Push all attachments (metadata + image blobs)
      const attachments = await db.attachments.toArray();
      for (const att of attachments) {
        try {
          // Upload metadata
          await provider.uploadJson(`attachments/meta-${att.id}.json`, att);

          // Upload actual image blob
          const blobRecord = await db.imageBlobs.get(att.localBlobRef);
          if (blobRecord) {
            await provider.uploadBlob(
              `attachments/img-${att.id}.${att.mimeType.split('/')[1] || 'jpg'}`,
              blobRecord.data,
              att.mimeType
            );
          }
          this.markSynced('attachment', att.id);
          pushed++;
        } catch (err) {
          this.markError('attachment', att.id, err instanceof Error ? err.message : 'Error desconegut');
          errors++;
        }
      }

      // 4. Push config/summary
      const summary = {
        appVersion: '2.0.0',
        totalLoans: loans.length,
        totalPayments: payments.length,
        totalAttachments: attachments.length,
        syncedAt: new Date().toISOString(),
      };
      await provider.uploadJson('config/sync-summary.json', summary);

      // 5. Push loans index for quick reference
      const loansIndex = loans.map(l => ({
        id: l.id,
        name: l.name,
        principalAmount: l.principalAmount,
        status: l.status,
        updatedAt: l.updatedAt,
      }));
      await provider.uploadJson('config/loans-index.json', loansIndex);

      // ── PULL: descarregar canvis remots ──
      pulled = await this.pullRemoteChanges(provider);

      // Clear successfully synced items from queue
      this.clearSyncedFromQueue();

      // Update last sync time
      cloudService.updateLastSync();

      const totalMessage = errors > 0
        ? `Sincronització parcial: ${pushed} pujats, ${pulled} descarregats, ${errors} errors.`
        : `Sincronització completa: ${pushed} pujats, ${pulled} descarregats.`;

      return {
        success: errors === 0,
        pushed,
        pulled,
        errors,
        message: totalMessage,
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error desconegut';
      return {
        success: false,
        pushed,
        pulled,
        errors: errors + 1,
        message: `Error de sincronització: ${msg}`,
      };
    }
  },

  /**
   * Pull changes from remote that don't exist locally
   */
  async pullRemoteChanges(provider: any): Promise<number> {
    let pulled = 0;

    try {
      // Check for loans in remote that we don't have locally
      const remoteFiles = await provider.listFiles('prestecs');

      for (const file of remoteFiles) {
        if (file.name.startsWith('loan-') && file.name.endsWith('.json')) {
          try {
            const remoteLoan = await provider.downloadJson(`prestecs/${file.name}`);
            if (!remoteLoan || !remoteLoan.id) continue;

            const localLoan = await db.loans.get(remoteLoan.id);
            if (!localLoan) {
              // New loan from remote - add it locally
              await db.loans.add(remoteLoan);
              pulled++;
            } else if (remoteLoan.updatedAt > localLoan.updatedAt) {
              // Remote is newer - update local (conflict resolution: newest wins)
              await db.loans.update(remoteLoan.id, remoteLoan);
              this.logConflict('loan', remoteLoan.id, localLoan.updatedAt, remoteLoan.updatedAt);
              pulled++;
            }
          } catch {
            // Skip individual file errors
          }
        }

        if (file.name.startsWith('payment-') && file.name.endsWith('.json')) {
          try {
            const remotePayment = await provider.downloadJson(`prestecs/${file.name}`);
            if (!remotePayment || !remotePayment.id) continue;

            const localPayment = await db.paymentRecords.get(remotePayment.id);
            if (!localPayment) {
              await db.paymentRecords.add(remotePayment);
              pulled++;
            } else if (remotePayment.updatedAt > localPayment.updatedAt) {
              await db.paymentRecords.update(remotePayment.id, remotePayment);
              this.logConflict('paymentRecord', remotePayment.id, localPayment.updatedAt, remotePayment.updatedAt);
              pulled++;
            }
          } catch {
            // Skip
          }
        }
      }
    } catch {
      // Ignore pull errors silently
    }

    return pulled;
  },

  /**
   * Reintentar elements amb errors
   */
  async retryErrors(): Promise<number> {
    const queue = loadQueue();
    let retried = 0;

    for (const item of queue) {
      if (item.status === 'error' && item.retryCount < item.maxRetries) {
        item.status = 'pending';
        item.retryCount++;
        item.updatedAt = new Date().toISOString();
        retried++;
      }
    }

    saveQueue(queue);

    if (retried > 0) {
      await this.syncAll();
    }

    return retried;
  },

  // ─── Queue helpers ──────────────────────────────

  markSynced(entityType: SyncEntityType, entityId: string): void {
    const queue = loadQueue();
    for (const item of queue) {
      if (item.entityType === entityType && item.entityId === entityId) {
        item.status = 'synced';
        item.updatedAt = new Date().toISOString();
      }
    }
    saveQueue(queue);
  },

  markError(entityType: SyncEntityType, entityId: string, errorMessage: string): void {
    const queue = loadQueue();
    for (const item of queue) {
      if (item.entityType === entityType && item.entityId === entityId && item.status === 'pending') {
        item.status = 'error';
        item.errorMessage = errorMessage;
        item.updatedAt = new Date().toISOString();
      }
    }
    saveQueue(queue);
  },

  clearSyncedFromQueue(): void {
    const queue = loadQueue();
    const filtered = queue.filter(q => q.status !== 'synced');
    saveQueue(filtered);
  },

  clearAllQueue(): void {
    saveQueue([]);
    saveConflicts([]);
  },

  // ─── Conflicts ──────────────────────────────────

  logConflict(
    entityType: SyncEntityType,
    entityId: string,
    localUpdatedAt: string,
    remoteUpdatedAt: string
  ): void {
    const conflicts = loadConflicts();
    conflicts.push({
      id: crypto.randomUUID(),
      entityType,
      entityId,
      localUpdatedAt,
      remoteUpdatedAt,
      resolution: remoteUpdatedAt > localUpdatedAt ? 'remote-wins' : 'local-wins',
      resolvedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
    // Keep last 100 conflicts
    if (conflicts.length > 100) conflicts.splice(0, conflicts.length - 100);
    saveConflicts(conflicts);
  },

  getConflicts(): SyncConflict[] {
    return loadConflicts();
  },

  // ─── Stats ──────────────────────────────────────

  getStats(): SyncStats {
    const queue = loadQueue();
    const conflicts = loadConflicts();
    const config = cloudService.loadSyncConfig();

    return {
      totalPending: queue.filter(q => q.status === 'pending').length,
      totalSynced: queue.filter(q => q.status === 'synced').length,
      totalErrors: queue.filter(q => q.status === 'error').length,
      totalConflicts: conflicts.filter(c => c.resolution === 'unresolved').length,
      lastSyncAt: config.lastFullSyncAt,
    };
  },

  getQueue(): SyncQueueItem[] {
    return loadQueue();
  },

  getErrorItems(): SyncQueueItem[] {
    return loadQueue().filter(q => q.status === 'error');
  },
};
