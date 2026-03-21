// ============================================
// OneDrive Provider — Esquelet preparat (Fase 3)
// ============================================

import type { CloudProvider, CloudProviderName, CloudFileInfo } from '../types';

/**
 * PENDENT D'IMPLEMENTAR
 * 
 * Per implementar OneDrive:
 * 1. Registra una app a https://portal.azure.com → App registrations
 * 2. Obté el Client ID
 * 3. Configura VITE_ONEDRIVE_CLIENT_ID al .env
 * 4. Implementa MSAL.js per autenticació
 * 5. Usa Microsoft Graph API per operacions de fitxers
 */

export class OneDriveProvider implements CloudProvider {
  readonly name: CloudProviderName = 'onedrive';
  readonly displayName = 'OneDrive';

  async isConnected(): Promise<boolean> {
    return false;
  }

  async connect(): Promise<{ success: boolean; error?: string }> {
    return {
      success: false,
      error: 'OneDrive no està disponible en aquesta versió. Properament!',
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
    throw new Error('OneDrive no implementat');
  }

  async downloadJson(_path: string): Promise<any | null> {
    return null;
  }

  async uploadBlob(_path: string, _blob: Blob, _mimeType: string): Promise<{ fileId: string }> {
    throw new Error('OneDrive no implementat');
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
