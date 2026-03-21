// ============================================
// Cloud Service — Gestor de proveïdors
// ============================================

import type {
  CloudProvider,
  CloudProviderName,
  CloudProviderInfo,
  CloudConnectionState,
  SyncConfig,
} from './types';
import { GoogleDriveProvider } from './providers/googleDriveProvider';
import { DropboxProvider } from './providers/dropboxProvider';
import { OneDriveProvider } from './providers/oneDriveProvider';

const SYNC_CONFIG_KEY = 'SHgestions_sync_config';

class CloudService {
  private providers: Map<CloudProviderName, CloudProvider> = new Map();
  private activeProvider: CloudProvider | null = null;

  constructor() {
    // Registrar tots els proveïdors disponibles
    this.providers.set('google-drive', new GoogleDriveProvider());
    this.providers.set('dropbox', new DropboxProvider());
    this.providers.set('onedrive', new OneDriveProvider());

    // Restaurar proveïdor actiu des de config guardada
    this.restoreActiveProvider();
  }

  // ─── Proveïdors disponibles ──────────────────────

  getAvailableProviders(): CloudProviderInfo[] {
    return [
      {
        name: 'google-drive',
        displayName: 'Google Drive',
        icon: '🔵',
        available: true,
      },
      {
        name: 'dropbox',
        displayName: 'Dropbox',
        icon: '🔷',
        available: false, // Stub
      },
      {
        name: 'onedrive',
        displayName: 'OneDrive',
        icon: '☁️',
        available: false, // Stub
      },
    ];
  }

  getProvider(name: CloudProviderName): CloudProvider | null {
    return this.providers.get(name) || null;
  }

  getActiveProvider(): CloudProvider | null {
    return this.activeProvider;
  }

  // ─── Connexió ───────────────────────────────────

  async connect(providerName: CloudProviderName): Promise<{ success: boolean; error?: string }> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      return { success: false, error: `Proveïdor ${providerName} no trobat.` };
    }

    const result = await provider.connect();
    if (result.success) {
      this.activeProvider = provider;
      await this.saveSyncConfig(providerName);
    }
    return result;
  }

  async disconnect(): Promise<void> {
    if (this.activeProvider) {
      await this.activeProvider.disconnect();
      this.activeProvider = null;
      await this.saveSyncConfig(null);
    }
  }

  async getConnectionState(): Promise<CloudConnectionState> {
    const config = this.loadSyncConfig();

    if (!this.activeProvider || !config.activeProvider) {
      return {
        provider: null,
        connected: false,
        userEmail: '',
        userName: '',
        lastSyncAt: config.lastFullSyncAt,
        lastSyncStatus: null,
        lastSyncMessage: '',
      };
    }

    const connected = await this.activeProvider.isConnected();
    let userEmail = '';
    let userName = '';

    if (connected) {
      try {
        const info = await this.activeProvider.getConnectionInfo();
        if (info) {
          userEmail = info.email;
          userName = info.name;
        }
      } catch {
        // Ignore
      }
    }

    return {
      provider: config.activeProvider,
      connected,
      userEmail,
      userName,
      lastSyncAt: config.lastFullSyncAt,
      lastSyncStatus: null,
      lastSyncMessage: '',
    };
  }

  // ─── Config persistence ─────────────────────────

  loadSyncConfig(): SyncConfig {
    const raw = localStorage.getItem(SYNC_CONFIG_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // Fall through
      }
    }
    return {
      id: 'sync-config',
      activeProvider: null,
      autoSync: false,
      autoSyncIntervalMinutes: 30,
      lastFullSyncAt: null,
      tokens: {},
      updatedAt: new Date().toISOString(),
    };
  }

  async saveSyncConfig(provider: CloudProviderName | null): Promise<void> {
    const config = this.loadSyncConfig();
    config.activeProvider = provider;
    config.updatedAt = new Date().toISOString();
    localStorage.setItem(SYNC_CONFIG_KEY, JSON.stringify(config));
  }

  updateLastSync(): void {
    const config = this.loadSyncConfig();
    config.lastFullSyncAt = new Date().toISOString();
    config.updatedAt = new Date().toISOString();
    localStorage.setItem(SYNC_CONFIG_KEY, JSON.stringify(config));
  }

  private restoreActiveProvider(): void {
    const config = this.loadSyncConfig();
    if (config.activeProvider) {
      const provider = this.providers.get(config.activeProvider);
      if (provider) {
        this.activeProvider = provider;
      }
    }
  }
}

// Singleton
export const cloudService = new CloudService();
