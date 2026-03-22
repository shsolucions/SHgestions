import type { CloudProvider, CloudProviderName, CloudFileInfo } from '../types';

const SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
const ROOT_FOLDER_NAME = 'SHgestions';

const FOLDER_STRUCTURE = ['config', 'prestecs', 'attachments', 'backups'];

interface TokenData {
  access_token: string;
  expires_at: number;
}

function getClientId(): string {
  const envId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
  if (envId) return envId;
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
  try { return JSON.parse(raw); } catch { return null; }
}

function clearToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

function isTokenValid(token: TokenData): boolean {
  return Date.now() < token.expires_at - 60000;
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
      return { success: false, error: 'Cal configurar el Google Client ID.' };
    }
    try {
      const token = await this.doOAuthFlow(clientId);
      this.token = token;
      saveToken(token);
      await this.ensureFolderStructure();
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconegut' };
    }
  }

  async disconnect(): Promise<void> {
    if (this.token) {
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${this.token.access_token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
      } catch { /* ignore */ }
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
    } catch { return null; }
  }

  async ensureFolderStructure(): Promise<void> {
    this.rootFolderId = await this.findOrCreateFolder(ROOT_FOLDER_NAME, 'root');
    for (const folder of FOLDER_STRUCTURE) {
      const folderId = await this.findOrCreateFolder(folder, this.rootFolderId);
      this.folderIds.set(folder, folderId);
    }
  }

  async uploadJson(path: string, data: any): Promise<{ fileId: string }> {
    const { folder, fileName } = this.parsePath(path);
    const parentId = await this.getParentId(folder);
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const existingId = await this.findFileId(fileName, parentId);
    if (existingId) {
      await this.apiUpload(`https://www.googleapis.com/upload/drive/v3/files/${existingId}?uploadType=media`, blob, 'application/json', 'PATCH');
      return { fileId: existingId };
    } else {
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
      await this.apiUpload(`https://www.googleapis.com/upload/drive/v3/files/${existingId}?uploadType=media`, blob, mimeType, 'PATCH');
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
      id: f.id, name: f.name, path: `${folderPath}/${f.name}`,
      mimeType: f.mimeType, size: parseInt(f.size || '0', 10), modifiedAt: f.modifiedTime || '',
    }));
  }

  async fileExists(path: string): Promise<boolean> {
    const { folder, fileName } = this.parsePath(path);
    const parentId = await this.getParentId(folder);
    return !!(await this.findFileId(fileName, parentId));
  }

  // ─── Private helpers ────────────────────

  private parsePath(path: string): { folder: string; fileName: string } {
    const parts = path.split('/');
    if (parts.length === 1) return { folder: '', fileName: parts[0] };
    const fileName = parts.pop()!;
    return { folder: parts.join('/'), fileName };
  }

  private async getParentId(folder: string): Promise<string> {
    if (!folder) return this.rootFolderId || 'root';
    const cached = this.folderIds.get(folder);
    if (cached) return cached;
    if (!this.rootFolderId) await this.ensureFolderStructure();
    const folderId = await this.findOrCreateFolder(folder, this.rootFolderId!);
    this.folderIds.set(folder, folderId);
    return folderId;
  }

  private async findOrCreateFolder(name: string, parentId: string): Promise<string> {
    const query = `name = '${name}' and '${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
    const res = await this.apiGet(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)&pageSize=1`);
    if (res.files && res.files.length > 0) return res.files[0].id;
    const metadata = { name, mimeType: 'application/vnd.google-apps.folder', parents: [parentId] };
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token!.access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(metadata),
    });
    if (!createRes.ok) throw new Error(`Error creant carpeta ${name}`);
    return (await createRes.json()).id;
  }

  private async findFileId(name: string, parentId: string): Promise<string | null> {
    const query = `name = '${name}' and '${parentId}' in parents and trashed = false`;
    const res = await this.apiGet(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id)&pageSize=1`);
    return res.files?.[0]?.id || null;
  }

  private async createFile(name: string, parentId: string, blob: Blob, mimeType: string): Promise<string> {
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify({ name, parents: [parentId] })], { type: 'application/json' }));
    form.append('file', blob);
    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token!.access_token}` },
      body: form,
    });
    if (!res.ok) throw new Error(`Error pujant fitxer ${name}`);
    return (await res.json()).id;
  }

  private async apiGet(url: string): Promise<any> {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${this.token!.access_token}` } });
    if (!res.ok) {
      if (res.status === 401) { clearToken(); this.token = null; throw new Error('Sessió expirada.'); }
      throw new Error(`API error: ${res.status}`);
    }
    return res.json();
  }

  private async apiUpload(url: string, blob: Blob, mimeType: string, method: string = 'PATCH'): Promise<void> {
    const res = await fetch(url, {
      method, headers: { Authorization: `Bearer ${this.token!.access_token}`, 'Content-Type': mimeType }, body: blob,
    });
    if (!res.ok) throw new Error(`Upload error: ${res.status}`);
  }

  // ─── OAuth2 Flow (robust, with postMessage) ────

  private doOAuthFlow(clientId: string): Promise<TokenData> {
    return new Promise((resolve, reject) => {
      const redirectUri = window.location.origin + '/oauth-callback';
      const state = crypto.randomUUID();

      // Save state for validation
      sessionStorage.setItem('oauth_state', state);

      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=token` +
        `&scope=${encodeURIComponent(SCOPES)}` +
        `&state=${state}` +
        `&prompt=consent`;

      const width = 500, height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(authUrl, 'google-auth',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );

      if (!popup) {
        reject(new Error("Permet les finestres emergents per connectar Google Drive."));
        return;
      }

      // Listen for message from popup/callback
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type !== 'oauth-callback') return;

        window.removeEventListener('message', handleMessage);
        clearTimeout(timeout);

        const { access_token, expires_in, error, returnedState } = event.data;

        if (error) {
          reject(new Error(error));
          return;
        }

        if (returnedState !== state) {
          reject(new Error('Estat OAuth invàlid.'));
          return;
        }

        if (!access_token) {
          reject(new Error("No s'ha rebut token."));
          return;
        }

        resolve({
          access_token,
          expires_at: Date.now() + (expires_in || 3600) * 1000,
        });
      };

      window.addEventListener('message', handleMessage);

      // Also poll as fallback (some browsers block postMessage)
      const pollInterval = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(pollInterval);
            // Check if token was saved by callback page
            const saved = loadToken();
            if (saved && isTokenValid(saved)) {
              window.removeEventListener('message', handleMessage);
              clearTimeout(timeout);
              resolve(saved);
            }
            return;
          }
        } catch { /* cross-origin, normal */ }
      }, 1000);

      const timeout = setTimeout(() => {
        clearInterval(pollInterval);
        window.removeEventListener('message', handleMessage);
        if (popup && !popup.closed) popup.close();
        reject(new Error("Temps esgotat (2 min)."));
      }, 120000);
    });
  }
}
