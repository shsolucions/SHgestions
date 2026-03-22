import React, { useState, useEffect, useCallback } from 'react';
import { cloudService, syncEngine } from '@/cloud';
import type { CloudConnectionState, SyncStats, CloudProviderInfo, SyncQueueItem } from '@/cloud/types';
import { useToast } from '@/context/ToastContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/EmptyState';
import { useTranslation } from '@/i18n';

/* ─── Official SVG logos ─── */
function GoogleDriveLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
      <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-20.4 35.3c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
      <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.4 9.35z" fill="#ea4335"/>
      <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
      <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
      <path d="m73.4 26.5-10.2-17.65c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 23.8h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
    </svg>
  );
}

function DropboxLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 43 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.6 0L0 7.7 8.8 14.2 21.4 7.1zM0 21.2L12.6 28.9 21.4 21.4 8.8 14.2zM21.4 21.4L30.3 28.9 42.9 21.2 34.1 14.2zM42.9 7.7L30.3 0 21.4 7.1 34.1 14.2zM21.5 23.1L12.6 30.6 8.8 28.2V31.6L21.5 39.1 34.1 31.6V28.2L30.3 30.6z" fill="#0061FF"/>
    </svg>
  );
}

function OneDriveLogo() {
  return (
    <svg width="34" height="24" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.5 2.5c1.2 0 2.3.4 3.2 1.2C13.3 1.6 15 .3 17 .3c2.8 0 5 2.2 5 5 0 .3 0 .5-.1.8.9.5 1.6 1.5 1.6 2.6 0 1.7-1.3 3-3 3H4C1.8 11.7 0 9.9 0 7.7 0 5.9 1.2 4.3 2.9 3.8c.2-1 1.3-1.8 2.5-1.8.8 0 1.5.3 2.1.7.5-.1 1.3-.2 2-.2z" fill="#0364B8"/>
      <path d="M14 4c.6 0 1.2.1 1.8.3C16.5 2.4 18.5 1 20.8 1c3 0 5.5 2.5 5.5 5.5 0 .2 0 .4-.1.6 1 .6 1.8 1.7 1.8 3 0 1.9-1.5 3.4-3.4 3.4H7.5C5 13.5 3 11.5 3 9s2-4.5 4.5-4.5c.4 0 .8.1 1.2.2C9.7 3 11.7 1.8 14 1.8" fill="#0078D4" transform="scale(0.8) translate(2,4)"/>
    </svg>
  );
}

function ProviderLogo({ name }: { name: string }) {
  if (name === 'google-drive') return <GoogleDriveLogo />;
  if (name === 'dropbox') return <DropboxLogo />;
  return <OneDriveLogo />;
}

/* ─── Component ─── */
export function CloudSettingsPage() {
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [connection, setConnection] = useState<CloudConnectionState | null>(null);
  const [stats, setStats] = useState<SyncStats | null>(null);
  const [providers, setProviders] = useState<CloudProviderInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configProvider, setConfigProvider] = useState('');
  const [clientId, setClientId] = useState('');
  const [showErrorsModal, setShowErrorsModal] = useState(false);
  const [errorItems, setErrorItems] = useState<SyncQueueItem[]>([]);

  const loadState = useCallback(async () => {
    try {
      const [conn, syncStats] = await Promise.all([
        cloudService.getConnectionState(),
        Promise.resolve(syncEngine.getStats()),
      ]);
      setConnection(conn);
      setStats(syncStats);
      setProviders(cloudService.getAvailableProviders());
      setErrorItems(syncEngine.getErrorItems());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadState(); }, [loadState]);

  const handleConnect = async (providerName: string) => {
    const keyMap: Record<string, { env: string; storage: string }> = {
      'google-drive': { env: 'VITE_GOOGLE_CLIENT_ID', storage: 'SHgestions_google_client_id' },
      'dropbox': { env: 'VITE_DROPBOX_APP_KEY', storage: 'SHgestions_dropbox_app_key' },
      'onedrive': { env: 'VITE_ONEDRIVE_CLIENT_ID', storage: 'SHgestions_onedrive_client_id' },
    };
    const cfg = keyMap[providerName];
    if (cfg) {
      const val = (import.meta as any).env?.[cfg.env] || localStorage.getItem(cfg.storage);
      if (!val) { setConfigProvider(providerName); setShowConfigModal(true); return; }
    }
    setConnectingProvider(providerName);
    try {
      const result = await cloudService.connect(providerName as any);
      if (result.success) addToast('success', t('connected') + ' ✓');
      else addToast('error', result.error || t('unexpectedError'));
    } catch { addToast('error', t('unexpectedError')); }
    finally { setConnectingProvider(null); loadState(); }
  };

  const handleDisconnect = async () => {
    try { await cloudService.disconnect(); addToast('info', t('disconnected')); }
    catch { addToast('error', t('unexpectedError')); }
    loadState();
  };

  const handleSync = async () => {
    setSyncing(true);
    try { await syncEngine.syncAll(); addToast('success', t('cloudSyncNow') + ' ✓'); }
    catch { addToast('error', t('unexpectedError')); }
    finally { setSyncing(false); loadState(); }
  };

  const handleSaveConfig = () => {
    if (!clientId.trim()) return;
    const keys: Record<string, string> = {
      'google-drive': 'SHgestions_google_client_id',
      'dropbox': 'SHgestions_dropbox_app_key',
      'onedrive': 'SHgestions_onedrive_client_id',
    };
    localStorage.setItem(keys[configProvider], clientId.trim());
    setShowConfigModal(false); setClientId('');
    addToast('success', t('save') + ' ✓');
  };

  const handleRetryErrors = async () => {
    setSyncing(true);
    try { await syncEngine.retryErrors(); addToast('success', t('retry') + ' ✓'); }
    catch { /* */ }
    finally { setSyncing(false); loadState(); }
  };

  const isConnected = connection?.connected || false;
  if (loading) return <LoadingSpinner text={t('loadingCloud')} />;

  const configLabels: Record<string, string> = { 'google-drive': 'Google Client ID', 'dropbox': 'Dropbox App Key', 'onedrive': 'OneDrive Client ID' };
  const configPlaceholders: Record<string, string> = { 'google-drive': 'xxx.apps.googleusercontent.com', 'dropbox': 'xxxxxxxxxxxx', 'onedrive': 'xxxxxxxx-xxxx-xxxx-xxxx' };
  const configTitles: Record<string, string> = { 'google-drive': 'Google Drive', 'dropbox': 'Dropbox', 'onedrive': 'OneDrive' };

  return (
    <div className="animate-fade-in space-y-4">
      <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">{t('cloudSettings')}</h2>

      {/* Connected info */}
      {isConnected && connection && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">{t('connectionStatus')}</p>
            <Badge variant="success">{t('connected')}</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <ProviderLogo name={connection.provider} />
              <div>
                <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{configTitles[connection.provider]}</p>
                {connection.userEmail && <p className="text-xs text-surface-500">{connection.userEmail}</p>}
              </div>
            </div>
            {connection.lastSyncAt && <p className="text-xs text-surface-400">{t('cloudLastSync')}: {new Date(connection.lastSyncAt).toLocaleString()}</p>}
            <div className="flex gap-2">
              <Button variant="primary" size="sm" fullWidth onClick={handleSync} loading={syncing}>{t('cloudSyncNow')}</Button>
              <Button variant="danger" size="sm" onClick={handleDisconnect}>{t('cloudDisconnect')}</Button>
            </div>
          </div>
        </Card>
      )}

      {/* ALL 3 providers — ALWAYS visible */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider px-1">{t('cloudProviders')}</p>
        {providers.map(provider => {
          const isActive = isConnected && connection?.provider === provider.name;
          const isLoading = connectingProvider === provider.name;
          return (
            <Card key={provider.name} className={`p-4 transition-all ${isActive ? 'ring-2 ring-green-500 bg-green-50/50 dark:bg-green-900/10' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <ProviderLogo name={provider.name} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{provider.displayName}</p>
                    <p className="text-xs text-surface-400">{isActive ? '✓ ' + t('connected') : t('cloudAvailable')}</p>
                  </div>
                </div>
                {isActive ? (
                  <Badge variant="success">{t('connected')}</Badge>
                ) : (
                  <Button size="sm" variant="primary" disabled={isLoading} loading={isLoading} onClick={() => handleConnect(provider.name)}>
                    {t('connect')}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Sync stats */}
      {stats && (
        <Card className="p-5">
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">{t('syncStatus')}</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { val: stats.totalPending, label: t('pendingItems'), color: 'text-amber-500' },
              { val: stats.totalSynced, label: t('synced'), color: 'text-emerald-500' },
              { val: stats.totalErrors, label: t('errors'), color: 'text-red-500' },
              { val: stats.totalConflicts, label: t('conflicts'), color: 'text-surface-500' },
            ].map(item => (
              <div key={item.label} className="text-center p-3 bg-surface-50 dark:bg-surface-900 rounded-xl">
                <p className={`text-2xl font-bold ${item.color}`}>{item.val}</p>
                <p className="text-[10px] uppercase tracking-wider text-surface-400 font-semibold mt-1">{item.label}</p>
              </div>
            ))}
          </div>
          {stats.totalErrors > 0 && (
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" size="sm" fullWidth onClick={() => setShowErrorsModal(true)}>{t('viewErrors')}</Button>
              <Button variant="secondary" size="sm" fullWidth onClick={handleRetryErrors} loading={syncing}>{t('retry')}</Button>
            </div>
          )}
        </Card>
      )}

      {/* How it works */}
      <Card className="p-4">
        <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">{t('howItWorks')}</p>
        <div className="text-xs text-surface-500 dark:text-surface-400 space-y-1.5">
          <p>• {t('cloudHow1')}</p>
          <p>• {t('cloudHow2')}</p>
          <p>• {t('cloudHow3')}</p>
          <p>• {t('cloudHow4')}</p>
          <p>• {t('cloudHow5')}</p>
        </div>
      </Card>

      {/* Config Modal */}
      <Modal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} title={configTitles[configProvider] || ''} maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="text-sm text-surface-600 dark:text-surface-400">{t('googleClientIdNeeded')}</p>
          <Input label={configLabels[configProvider] || 'Client ID'} value={clientId} onChange={e => setClientId(e.target.value)} placeholder={configPlaceholders[configProvider] || ''} hint={t('googleClientIdHint')} />
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setShowConfigModal(false)}>{t('cancel')}</Button>
            <Button fullWidth onClick={handleSaveConfig} disabled={!clientId.trim()}>{t('save')}</Button>
          </div>
        </div>
      </Modal>

      {/* Errors Modal */}
      <Modal isOpen={showErrorsModal} onClose={() => setShowErrorsModal(false)} title={t('cloudSyncErrorsTitle')} maxWidth="max-w-md">
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {errorItems.length === 0 ? (
            <p className="text-sm text-surface-400 text-center py-4">{t('noErrors')}</p>
          ) : errorItems.map(item => (
            <div key={item.id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="danger">{item.entityType}</Badge>
                <span className="text-[10px] text-surface-400">{t('attempt')} {item.retryCount}/{item.maxRetries}</span>
              </div>
              <p className="text-xs text-red-600 dark:text-red-400">{item.errorMessage}</p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
