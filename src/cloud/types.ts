// ============================================
// SHgestions — Cloud Types (Fase 2)
// ============================================

export type CloudProviderName = 'google-drive' | 'dropbox' | 'onedrive';
export type SyncItemStatus = 'pending' | 'synced' | 'error';
export type SyncDirection = 'push' | 'pull';
export type SyncEntityType = 'user' | 'loan' | 'paymentRecord' | 'attachment' | 'config';

export interface CloudProviderInfo {
  name: CloudProviderName;
  displayName: string;
  icon: string;
  available: boolean;
}

export interface CloudConnectionState {
  provider: CloudProviderName | null;
  connected: boolean;
  userEmail: string;
  userName: string;
  lastSyncAt: string | null;
  lastSyncStatus: 'success' | 'error' | 'partial' | null;
  lastSyncMessage: string;
}

export interface SyncQueueItem {
  id: string;
  entityType: SyncEntityType;
  entityId: string;
  direction: SyncDirection;
  status: SyncItemStatus;
  retryCount: number;
  maxRetries: number;
  errorMessage: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyncConflict {
  id: string;
  entityType: SyncEntityType;
  entityId: string;
  localUpdatedAt: string;
  remoteUpdatedAt: string;
  resolution: 'local-wins' | 'remote-wins' | 'unresolved';
  resolvedAt: string | null;
  createdAt: string;
}

export interface SyncStats {
  totalPending: number;
  totalSynced: number;
  totalErrors: number;
  totalConflicts: number;
  lastSyncAt: string | null;
}

/**
 * Interface que tots els proveïdors cloud han d'implementar.
 * Google Drive, Dropbox, OneDrive...
 */
export interface CloudProvider {
  readonly name: CloudProviderName;
  readonly displayName: string;

  // Autenticació
  isConnected(): Promise<boolean>;
  connect(): Promise<{ success: boolean; error?: string }>;
  disconnect(): Promise<void>;
  getConnectionInfo(): Promise<{ email: string; name: string } | null>;

  // Estructura de carpetes
  ensureFolderStructure(): Promise<void>;

  // Operacions CRUD sobre fitxers
  uploadJson(path: string, data: any): Promise<{ fileId: string }>;
  downloadJson(path: string): Promise<any | null>;
  uploadBlob(path: string, blob: Blob, mimeType: string): Promise<{ fileId: string }>;
  downloadBlob(path: string): Promise<Blob | null>;
  deleteFile(path: string): Promise<void>;
  listFiles(folderPath: string): Promise<CloudFileInfo[]>;
  fileExists(path: string): Promise<boolean>;
}

export interface CloudFileInfo {
  id: string;
  name: string;
  path: string;
  mimeType: string;
  size: number;
  modifiedAt: string;
}

/**
 * Configuració de sincronització guardada localment
 */
export interface SyncConfig {
  id: string;
  activeProvider: CloudProviderName | null;
  autoSync: boolean;
  autoSyncIntervalMinutes: number;
  lastFullSyncAt: string | null;
  tokens: Record<string, string>; // provider → serialized token
  updatedAt: string;
}
