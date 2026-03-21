// ============================================
// Dropbox Provider — Esquelet preparat (Fase 3)
// ============================================

import type { CloudProvider, CloudProviderName, CloudFileInfo } from '../types';

/**
 * PENDENT D'IMPLEMENTAR
 * 
 * Per implementar Dropbox:
 * 1. Registra una app a https://www.dropbox.com/developers
 * 2. Obté l'App Key
 * 3. Configura VITE_DROPBOX_APP_KEY al .env
 * 4. Implementa OAuth2 PKCE flow
 * 5. Usa Dropbox HTTP API v2 per operacions de fitxers
 */

export class DropboxProvider implements CloudProvider {
  readonly name: CloudProviderName = 'dropbox';
  readonly displayName = 'Dropbox';

  async isConnected(): Promise<boolean> {
    return false;
  }

  async connect(): Promise<{ success: boolean; error?: string }> {
    return {
      success: false,
      error: 'Dropbox no està disponible en aquesta versió. Properament!',
    };
  }

  async disconnect(): Promise<void> {
    // Stub
  }

  async getConnectionInfo(): Promise<{ email: string; name: string } | null> {
    return null;
  }

  async ensureFolderStructure(): Promise<void> {
    // Stub
  }

  async uploadJson(_path: string, _data: any): Promise<{ fileId: string }> {
    throw new Error('Dropbox no implementat');
  }

  async downloadJson(_path: string): Promise<any | null> {
    return null;
  }

  async uploadBlob(_path: string, _blob: Blob, _mimeType: string): Promise<{ fileId: string }> {
    throw new Error('Dropbox no implementat');
  }

  async downloadBlob(_path: string): Promise<Blob | null> {
    return null;
  }

  async deleteFile(_path: string): Promise<void> {
    // Stub
  }

  async listFiles(_folderPath: string): Promise<CloudFileInfo[]> {
    return [];
  }

  async fileExists(_path: string): Promise<boolean> {
    return false;
  }
}
