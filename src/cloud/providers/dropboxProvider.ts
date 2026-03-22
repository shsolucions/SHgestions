import type { CloudProvider, CloudProviderName, CloudFileInfo } from '../types';

const ROOT_FOLDER = '/SHgestions';
const FOLDERS = ['/config', '/prestecs', '/attachments', '/backups'];
const TOKEN_KEY = 'SHgestions_dropbox_token';

interface TokenData {
  access_token: string;
  expires_at: number;
}

function getAppKey(): string {
  const envKey = (import.meta as any).env?.VITE_DROPBOX_APP_KEY;
  if (envKey) return envKey;
  return localStorage.getItem('SHgestions_dropbox_app_key') || '';
}

function saveToken(token: TokenData): void { localStorage.setItem(TOKEN_KEY, JSON.stringify(token)); }
function loadToken(): TokenData | null {
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
function clearToken(): void { localStorage.removeItem(TOKEN_KEY); }
function isTokenValid(t: TokenData): boolean { return Date.now() < t.expires_at - 60000; }

export class DropboxProvider implements CloudProvider {
  readonly name: CloudProviderName = 'dropbox';
  readonly displayName = 'Dropbox';
  private token: TokenData | null = null;

  constructor() { this.token = loadToken(); }

  async isConnected(): Promise<boolean> {
    if (!this.token) return false;
    if (!isTokenValid(this.token)) { clearToken(); this.token = null; return false; }
    return true;
  }

  async connect(): Promise<{ success: boolean; error?: string }> {
    const appKey = getAppKey();
    if (!appKey) {
      return { success: false, error: 'Cal configurar el Dropbox App Key. Ves a https://www.dropbox.com/developers i crea una app.' };
    }
    try {
      const token = await this.doOAuthFlow(appKey);
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
        await fetch('https://api.dropboxapi.com/2/auth/token/revoke', {
          method: 'POST',
          headers: { Authorization: `Bearer ${this.token.access_token}` },
        });
      } catch { /* ignore */ }
    }
    clearToken(); this.token = null;
  }

  async getConnectionInfo(): Promise<{ email: string; name: string } | null> {
    if (!(await this.isConnected())) return null;
    try {
      const res = await fetch('https://api.dropboxapi.com/2/users/get_current_account', {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.token!.access_token}` },
      });
      const data = await res.json();
      return { email: data.email || '', name: data.name?.display_name || '' };
    } catch { return null; }
  }

  async ensureFolderStructure(): Promise<void> {
    // Create root folder
    await this.createFolderIfNotExists(ROOT_FOLDER);
    for (const folder of FOLDERS) {
      await this.createFolderIfNotExists(ROOT_FOLDER + folder);
    }
  }

  async uploadJson(path: string, data: any): Promise<{ fileId: string }> {
    const fullPath = `${ROOT_FOLDER}/${path}`;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const res = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token!.access_token}`,
        'Dropbox-API-Arg': JSON.stringify({ path: fullPath, mode: 'overwrite', autorename: false }),
        'Content-Type': 'application/octet-stream',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`Upload error: ${res.status}`);
    const result = await res.json();
    return { fileId: result.id };
  }

  async downloadJson(path: string): Promise<any | null> {
    const fullPath = `${ROOT_FOLDER}/${path}`;
    try {
      const res = await fetch('https://content.dropboxapi.com/2/files/download', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token!.access_token}`,
          'Dropbox-API-Arg': JSON.stringify({ path: fullPath }),
        },
      });
      if (!res.ok) return null;
      return res.json();
    } catch { return null; }
  }

  async uploadBlob(path: string, blob: Blob, mimeType: string): Promise<{ fileId: string }> {
    const fullPath = `${ROOT_FOLDER}/${path}`;
    const res = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token!.access_token}`,
        'Dropbox-API-Arg': JSON.stringify({ path: fullPath, mode: 'overwrite', autorename: false }),
        'Content-Type': 'application/octet-stream',
      },
      body: blob,
    });
    if (!res.ok) throw new Error(`Upload error: ${res.status}`);
    const result = await res.json();
    return { fileId: result.id };
  }

  async downloadBlob(path: string): Promise<Blob | null> {
    const fullPath = `${ROOT_FOLDER}/${path}`;
    try {
      const res = await fetch('https://content.dropboxapi.com/2/files/download', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token!.access_token}`,
          'Dropbox-API-Arg': JSON.stringify({ path: fullPath }),
        },
      });
      if (!res.ok) return null;
      return res.blob();
    } catch { return null; }
  }

  async deleteFile(path: string): Promise<void> {
    const fullPath = `${ROOT_FOLDER}/${path}`;
    await fetch('https://api.dropboxapi.com/2/files/delete_v2', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token!.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: fullPath }),
    });
  }

  async listFiles(folderPath: string): Promise<CloudFileInfo[]> {
    const fullPath = `${ROOT_FOLDER}/${folderPath}`;
    try {
      const res = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token!.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: fullPath, limit: 1000 }),
      });
      if (!res.ok) return [];
      const data = await res.json();
      return (data.entries || []).map((f: any) => ({
        id: f.id, name: f.name, path: f.path_display,
        mimeType: '', size: f.size || 0,
        modifiedAt: f.server_modified || '',
      }));
    } catch { return []; }
  }

  async fileExists(path: string): Promise<boolean> {
    const fullPath = `${ROOT_FOLDER}/${path}`;
    try {
      const res = await fetch('https://api.dropboxapi.com/2/files/get_metadata', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token!.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: fullPath }),
      });
      return res.ok;
    } catch { return false; }
  }

  // ─── Private ─────────────────

  private async createFolderIfNotExists(path: string): Promise<void> {
    try {
      await fetch('https://api.dropboxapi.com/2/files/create_folder_v2', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token!.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path, autorename: false }),
      });
    } catch { /* folder may already exist */ }
  }

  private doOAuthFlow(appKey: string): Promise<TokenData> {
    return new Promise((resolve, reject) => {
      const redirectUri = window.location.origin + '/oauth-callback';
      const state = crypto.randomUUID();
      sessionStorage.setItem('oauth_state', state);
      sessionStorage.setItem('oauth_provider', 'dropbox');

      const authUrl = `https://www.dropbox.com/oauth2/authorize?` +
        `client_id=${encodeURIComponent(appKey)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=token` +
        `&state=${state}` +
        `&token_access_type=online`;

      const w = 500, h = 600;
      const left = window.screenX + (window.outerWidth - w) / 2;
      const top = window.screenY + (window.outerHeight - h) / 2;
      const popup = window.open(authUrl, 'dropbox-auth', `width=${w},height=${h},left=${left},top=${top}`);

      if (!popup) { reject(new Error("Permet les finestres emergents.")); return; }

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type !== 'oauth-callback') return;
        window.removeEventListener('message', handleMessage);
        clearTimeout(timeout);
        const { access_token, expires_in, error } = event.data;
        if (error) { reject(new Error(error)); return; }
        if (!access_token) { reject(new Error("No s'ha rebut token.")); return; }
        resolve({ access_token, expires_at: Date.now() + (expires_in || 14400) * 1000 });
      };

      window.addEventListener('message', handleMessage);

      const pollInterval = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(pollInterval);
            const saved = loadToken();
            if (saved && isTokenValid(saved)) {
              window.removeEventListener('message', handleMessage);
              clearTimeout(timeout);
              resolve(saved);
            }
          }
        } catch { /* cross-origin */ }
      }, 1000);

      const timeout = setTimeout(() => {
        clearInterval(pollInterval);
        window.removeEventListener('message', handleMessage);
        if (!popup.closed) popup.close();
        reject(new Error("Temps esgotat."));
      }, 120000);
    });
  }
}
