// ============================================
// Google Drive Provider — Implementació completa
// ============================================

import type { CloudProvider, CloudProviderName, CloudFileInfo } from '../types';

const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const ROOT_FOLDER_NAME = 'SHgestions';

// Estructura de carpetes dins Google Drive
const FOLDER_STRUCTURE = [
  'config',
  'prestecs',
  'attachments',
  'backups',
];

interface TokenData {
  access_token: string;
  expires_at: number;
  refresh_token?: string;
}

/**
 * Per configurar el teu Client ID:
 * 
 * 1. Ves a https://console.cloud.google.com
 * 2. Crea un projecte nou (o selecciona un existent)
 * 3. Activa l'API "Google Drive API"
 * 4. Ves a "Credencials" → "Crear credencials" → "ID de client OAuth"
 * 5. Tipus: "Aplicació web"
 * 6. Orígens autoritzats: http://localhost:5173 (dev) + la URL de producció
 * 7. URIs de redirecció: http://localhost:5173 (dev) + la URL de producció
 * 8. Copia el Client ID i posa'l a la variable d'entorn VITE_GOOGLE_CLIENT_ID
 *    o directament al fitxer .env:
 *    VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
 */

function getClientId(): string {
  // Intenta llegir de variable d'entorn de Vite
  const envId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;
  if (envId) return envId;

  // Fallback: busca en localStorage per si l'usuari l'ha configurat via UI
  const stored = localStorage.getItem('SHgestions_google_client_id');
  if (stored) return stored;

  return '';
}

const TOKEN_STORAGE_KEY = 'SHgestions_gdrive_token';

function saveToken(token: TokenData): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));
}

function loadToken(): TokenData | null {
  const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

function isTokenValid(token: TokenData): boolean {
  return Date.now() < token.expires_at - 60000; // 1 min margin
}

export class GoogleDriveProvider implements CloudProvider {
  readonly name: CloudProviderName = 'google-drive';
  readonly displayName = 'Google Drive';

  private token: TokenData | null = null;
  private rootFolderId: string | null = null;
  private folderIds: Map<string, string> = new Map();

  constructor() {
    this.token = loadToken();
  }

  // ─── Autenticació ───────────────────────────────

  async isConnected(): Promise<boolean> {
    if (!this.token) return false;
    if (!isTokenValid(this.token)) {
      clearToken();
      this.token = null;
      return false;
    }
    return true;
  }

  async connect(): Promise<{ success: boolean; error?: string }> {
    const clientId = getClientId();
    if (!clientId) {
      return {
        success: false,
        error: 'Cal configurar el Google Client ID. Ves a Configuració > Núvol > Client ID.',
      };
    }

    try {
      // OAuth2 implicit flow via popup
      const token = await this.doOAuthFlow(clientId);
      this.token = token;
      saveToken(token);

      // Crear estructura de carpetes
      await this.ensureFolderStructure();

      return { success: true };
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error desconegut';
      return { success: false, error: msg };
    }
  }

  async disconnect(): Promise<void> {
    if (this.token) {
      // Revoca el token
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${this.token.access_token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
      } catch {
        // Ignore revoke errors
      }
    }
    clearToken();
    this.token = null;
    this.rootFolderId = null;
    this.folderIds.clear();
  }

  async getConnectionInfo(): Promise<{ email: string; name: string } | null> {
    if (!(await this.isConnected())) return null;
    try {
      const res = await this.apiGet('https://www.googleapis.com/oauth2/v2/userinfo');
      return { email: res.email || '', name: res.name || '' };
    } catch {
      return null;
    }
  }

  // ─── Estructura de carpetes ─────────────────────

  async ensureFolderStructure(): Promise<void> {
    // Buscar o crear la carpeta arrel
    this.rootFolderId = await this.findOrCreateFolder(ROOT_FOLDER_NAME, 'root');

    // Crear subcarpetes
    for (const folder of FOLDER_STRUCTURE) {
      const folderId = await this.findOrCreateFolder(folder, this.rootFolderId);
      this.folderIds.set(folder, folderId);
    }
  }

  // ─── Operacions CRUD ────────────────────────────

  async uploadJson(path: string, data: any): Promise<{ fileId: string }> {
    const { folder, fileName } = this.parsePath(path);
    const parentId = await this.getParentId(folder);
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });

    // Check if file exists
    const existingId = await this.findFileId(fileName, parentId);

    if (existingId) {
      // Update existing
      await this.apiUpload(
        `https://www.googleapis.com/upload/drive/v3/files/${existingId}?uploadType=media`,
        blob,
        'application/json',
        'PATCH'
      );
      return { fileId: existingId };
    } else {
      // Create new
      const fileId = await this.createFile(fileName, parentId, blob, 'application/json');
      return { fileId };
    }
  }

  async downloadJson(path: string): Promise<any | null> {
    const { folder, fileName } = this.parsePath(path);
    const parentId = await this.getParentId(folder);
    const fileId = await this.findFileId(fileName, parentId);

    if (!fileId) return null;

    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${this.token!.access_token}` },
    });

    if (!res.ok) return null;
    return res.json();
  }

  async uploadBlob(path: string, blob: Blob, mimeType: string): Promise<{ fileId: string }> {
    const { folder, fileName } = this.parsePath(path);
    const parentId = await this.getParentId(folder);

    const existingId = await this.findFileId(fileName, parentId);

    if (existingId) {
      await this.apiUpload(
        `https://www.googleapis.com/upload/drive/v3/files/${existingId}?uploadType=media`,
        blob,
        mimeType,
        'PATCH'
      );
      return { fileId: existingId };
    } else {
      const fileId = await this.createFile(fileName, parentId, blob, mimeType);
      return { fileId };
    }
  }

  async downloadBlob(path: string): Promise<Blob | null> {
    const { folder, fileName } = this.parsePath(path);
    const parentId = await this.getParentId(folder);
    const fileId = await this.findFileId(fileName, parentId);

    if (!fileId) return null;

    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${this.token!.access_token}` },
    });

    if (!res.ok) return null;
    return res.blob();
  }

  async deleteFile(path: string): Promise<void> {
    const { folder, fileName } = this.parsePath(path);
    const parentId = await this.getParentId(folder);
    const fileId = await this.findFileId(fileName, parentId);

    if (fileId) {
      await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${this.token!.access_token}` },
      });
    }
  }

  async listFiles(folderPath: string): Promise<CloudFileInfo[]> {
    const parentId = await this.getParentId(folderPath);

    const query = `'${parentId}' in parents and trashed = false`;
    const res = await this.apiGet(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,size,modifiedTime)&pageSize=1000`
    );

    return (res.files || []).map((f: any) => ({
      id: f.id,
      name: f.name,
      path: `${folderPath}/${f.name}`,
      mimeType: f.mimeType,
      size: parseInt(f.size || '0', 10),
      modifiedAt: f.modifiedTime || '',
    }));
  }

  async fileExists(path: string): Promise<boolean> {
    const { folder, fileName } = this.parsePath(path);
    const parentId = await this.getParentId(folder);
    const id = await this.findFileId(fileName, parentId);
    return !!id;
  }

  // ─── Helpers privats ────────────────────────────

  private parsePath(path: string): { folder: string; fileName: string } {
    // path format: "config/sync-config.json" or "prestecs/loan-123.json"
    const parts = path.split('/');
    if (parts.length === 1) {
      return { folder: '', fileName: parts[0] };
    }
    const fileName = parts.pop()!;
    const folder = parts.join('/');
    return { folder, fileName };
  }

  private async getParentId(folder: string): Promise<string> {
    if (!folder || folder === '') {
      return this.rootFolderId || 'root';
    }

    // Simple: direct subfolder name
    const cached = this.folderIds.get(folder);
    if (cached) return cached;

    // Try to find/create it
    if (!this.rootFolderId) {
      await this.ensureFolderStructure();
    }

    const folderId = await this.findOrCreateFolder(folder, this.rootFolderId!);
    this.folderIds.set(folder, folderId);
    return folderId;
  }

  private async findOrCreateFolder(name: string, parentId: string): Promise<string> {
    // Search for existing folder
    const query = `name = '${name}' and '${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
    const res = await this.apiGet(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)&pageSize=1`
    );

    if (res.files && res.files.length > 0) {
      return res.files[0].id;
    }

    // Create folder
    const metadata = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    };

    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token!.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });

    if (!createRes.ok) {
      throw new Error(`Error creant carpeta ${name}: ${createRes.statusText}`);
    }

    const created = await createRes.json();
    return created.id;
  }

  private async findFileId(name: string, parentId: string): Promise<string | null> {
    const query = `name = '${name}' and '${parentId}' in parents and trashed = false`;
    const res = await this.apiGet(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id)&pageSize=1`
    );

    if (res.files && res.files.length > 0) {
      return res.files[0].id;
    }
    return null;
  }

  private async createFile(
    name: string,
    parentId: string,
    blob: Blob,
    mimeType: string
  ): Promise<string> {
    const metadata = { name, parents: [parentId] };

    const form = new FormData();
    form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    form.append('file', blob);

    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.token!.access_token}` },
        body: form,
      }
    );

    if (!res.ok) {
      throw new Error(`Error pujant fitxer ${name}: ${res.statusText}`);
    }

    const data = await res.json();
    return data.id;
  }

  private async apiGet(url: string): Promise<any> {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${this.token!.access_token}` },
    });

    if (!res.ok) {
      if (res.status === 401) {
        clearToken();
        this.token = null;
        throw new Error('Sessió expirada. Cal reconnectar Google Drive.');
      }
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }

  private async apiUpload(
    url: string,
    blob: Blob,
    mimeType: string,
    method: string = 'PATCH'
  ): Promise<void> {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${this.token!.access_token}`,
        'Content-Type': mimeType,
      },
      body: blob,
    });

    if (!res.ok) {
      throw new Error(`Upload error: ${res.status} ${res.statusText}`);
    }
  }

  // ─── OAuth2 Flow ────────────────────────────────

  private doOAuthFlow(clientId: string): Promise<TokenData> {
    return new Promise((resolve, reject) => {
      const redirectUri = window.location.origin;
      const state = crypto.randomUUID();

      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=token` +
        `&scope=${encodeURIComponent(SCOPES + ' https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile')}` +
        `&state=${state}` +
        `&prompt=consent` +
        `&include_granted_scopes=true`;

      // Open popup
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        authUrl,
        'google-auth',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );

      if (!popup) {
        reject(new Error('No s\'ha pogut obrir la finestra d\'autenticació. Permet les finestres emergents.'));
        return;
      }

      // Poll popup for redirect with token
      const pollInterval = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(pollInterval);
            reject(new Error('Finestra d\'autenticació tancada.'));
            return;
          }

          const popupUrl = popup.location.href;
          if (popupUrl.startsWith(redirectUri)) {
            clearInterval(pollInterval);
            popup.close();

            // Parse token from URL fragment
            const hash = popup.location.hash.substring(1);
            const params = new URLSearchParams(hash);

            const accessToken = params.get('access_token');
            const expiresIn = parseInt(params.get('expires_in') || '3600', 10);
            const returnedState = params.get('state');

            if (returnedState !== state) {
              reject(new Error('Estat OAuth invàlid. Possible atac CSRF.'));
              return;
            }

            if (!accessToken) {
              const error = params.get('error') || 'No s\'ha rebut cap token';
              reject(new Error(error));
              return;
            }

            const tokenData: TokenData = {
              access_token: accessToken,
              expires_at: Date.now() + expiresIn * 1000,
            };

            resolve(tokenData);
          }
        } catch {
          // Cross-origin error while popup is on Google's domain - this is normal
        }
      }, 500);

      // Timeout after 2 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (!popup.closed) popup.close();
        reject(new Error('Temps d\'autenticació esgotat (2 minuts).'));
      }, 120000);
    });
  }
}
