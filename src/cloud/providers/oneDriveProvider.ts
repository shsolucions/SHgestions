import type { CloudProvider, CloudProviderName, CloudFileInfo } from '../types';

const ROOT_FOLDER = 'SHgestions';
const FOLDERS = ['config', 'prestecs', 'attachments', 'backups'];
const TOKEN_KEY = 'SHgestions_onedrive_token';
const GRAPH_URL = 'https://graph.microsoft.com/v1.0';

interface TokenData {
  access_token: string;
  expires_at: number;
}

function getClientId(): string {
  const envId = (import.meta as any).env?.VITE_ONEDRIVE_CLIENT_ID;
  if (envId) return envId;
  return localStorage.getItem('SHgestions_onedrive_client_id') || '';
}

function saveToken(token: TokenData): void { localStorage.setItem(TOKEN_KEY, JSON.stringify(token)); }
function loadToken(): TokenData | null {
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
function clearToken(): void { localStorage.removeItem(TOKEN_KEY); }
function isTokenValid(t: TokenData): boolean { return Date.now() < t.expires_at - 60000; }

export class OneDriveProvider implements CloudProvider {
  readonly name: CloudProviderName = 'onedrive';
  readonly displayName = 'OneDrive';
  private token: TokenData | null = null;

  constructor() { this.token = loadToken(); }

  async isConnected(): Promise<boolean> {
    if (!this.token) return false;
    if (!isTokenValid(this.token)) { clearToken(); this.token = null; return false; }
    return true;
  }

  async connect(): Promise<{ success: boolean; error?: string }> {
    const clientId = getClientId();
    if (!clientId) {
      return { success: false, error: 'Cal configurar el OneDrive Client ID. Ves a https://portal.azure.com → App registrations.' };
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
    clearToken(); this.token = null;
  }

  async getConnectionInfo(): Promise<{ email: string; name: string } | null> {
    if (!(await this.isConnected())) return null;
    try {
      const res = await this.apiGet(`${GRAPH_URL}/me`);
      return { email: res.mail || res.userPrincipalName || '', name: res.displayName || '' };
    } catch { return null; }
  }

  async ensureFolderStructure(): Promise<void> {
    await this.createFolderIfNotExists(ROOT_FOLDER, 'root');
    for (const folder of FOLDERS) {
      await this.createFolderIfNotExists(folder, ROOT_FOLDER);
    }
  }

  async uploadJson(path: string, data: any): Promise<{ fileId: string }> {
    const fullPath = `${ROOT_FOLDER}/${path}`;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const res = await fetch(`${GRAPH_URL}/me/drive/root:/${fullPath}:/content`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.token!.access_token}`,
        'Content-Type': 'application/json',
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
      const res = await fetch(`${GRAPH_URL}/me/drive/root:/${fullPath}:/content`, {
        headers: { Authorization: `Bearer ${this.token!.access_token}` },
      });
      if (!res.ok) return null;
      return res.json();
    } catch { return null; }
  }

  async uploadBlob(path: string, blob: Blob, mimeType: string): Promise<{ fileId: string }> {
    const fullPath = `${ROOT_FOLDER}/${path}`;
    const res = await fetch(`${GRAPH_URL}/me/drive/root:/${fullPath}:/content`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.token!.access_token}`,
        'Content-Type': mimeType,
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
      const res = await fetch(`${GRAPH_URL}/me/drive/root:/${fullPath}:/content`, {
        headers: { Authorization: `Bearer ${this.token!.access_token}` },
      });
      if (!res.ok) return null;
      return res.blob();
    } catch { return null; }
  }

  async deleteFile(path: string): Promise<void> {
    const fullPath = `${ROOT_FOLDER}/${path}`;
    await fetch(`${GRAPH_URL}/me/drive/root:/${fullPath}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${this.token!.access_token}` },
    });
  }

  async listFiles(folderPath: string): Promise<CloudFileInfo[]> {
    const fullPath = `${ROOT_FOLDER}/${folderPath}`;
    try {
      const res = await this.apiGet(`${GRAPH_URL}/me/drive/root:/${fullPath}:/children`);
      return (res.value || []).map((f: any) => ({
        id: f.id, name: f.name, path: `${folderPath}/${f.name}`,
        mimeType: f.file?.mimeType || '', size: f.size || 0,
        modifiedAt: f.lastModifiedDateTime || '',
      }));
    } catch { return []; }
  }

  async fileExists(path: string): Promise<boolean> {
    const fullPath = `${ROOT_FOLDER}/${path}`;
    try {
      const res = await fetch(`${GRAPH_URL}/me/drive/root:/${fullPath}`, {
        headers: { Authorization: `Bearer ${this.token!.access_token}` },
      });
      return res.ok;
    } catch { return false; }
  }

  // ─── Private ─────────────────

  private async apiGet(url: string): Promise<any> {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${this.token!.access_token}` } });
    if (!res.ok) {
      if (res.status === 401) { clearToken(); this.token = null; throw new Error('Sessió expirada.'); }
      throw new Error(`API error: ${res.status}`);
    }
    return res.json();
  }

  private async createFolderIfNotExists(name: string, parent: string): Promise<void> {
    const parentPath = parent === 'root' ? '' : `/root:/${parent}:`;
    try {
      await fetch(`${GRAPH_URL}/me/drive${parentPath || '/root'}/children`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token!.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name, folder: {}, '@microsoft.graph.conflictBehavior': 'fail',
        }),
      });
    } catch { /* folder may exist */ }
  }

  private doOAuthFlow(clientId: string): Promise<TokenData> {
    return new Promise((resolve, reject) => {
      const redirectUri = window.location.origin + '/oauth-callback';
      const state = crypto.randomUUID();
      sessionStorage.setItem('oauth_state', state);
      sessionStorage.setItem('oauth_provider', 'onedrive');

      const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=token` +
        `&scope=${encodeURIComponent('Files.ReadWrite User.Read')}` +
        `&state=${state}` +
        `&prompt=consent`;

      const w = 500, h = 600;
      const left = window.screenX + (window.outerWidth - w) / 2;
      const top = window.screenY + (window.outerHeight - h) / 2;
      const popup = window.open(authUrl, 'onedrive-auth', `width=${w},height=${h},left=${left},top=${top}`);

      if (!popup) { reject(new Error("Permet les finestres emergents.")); return; }

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type !== 'oauth-callback') return;
        window.removeEventListener('message', handleMessage);
        clearTimeout(timeout);
        const { access_token, expires_in, error } = event.data;
        if (error) { reject(new Error(error)); return; }
        if (!access_token) { reject(new Error("No s'ha rebut token.")); return; }
        resolve({ access_token, expires_at: Date.now() + (expires_in || 3600) * 1000 });
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
