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
import { GoogleDriveLogo, DropboxLogo, OneDriveLogo } from '@/components/ui/CloudLogos';
import { formatDate } from '@/utils/formatters';
import { useTranslation } from '@/i18n';

export function CloudSettingsPage() {
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [connection, setConnection] = useState<CloudConnectionState | null>(null);
  const [stats, setStats] = useState<SyncStats | null>(null);
  const [providers, setProviders] = useState<CloudProviderInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [showClientIdModal, setShowClientIdModal] = useState(false);
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
    } catch (error) {
      console.error('Error loading cloud state:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadState();
  }, [loadState]);

  const [configProvider, setConfigProvider] = useState<string>('');

  const handleConnect = async (providerName: string) => {
    // Check if credentials are configured
    if (providerName === 'google-drive') {
      const envId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
      const storedId = localStorage.getItem('SHgestions_google_client_id');
      if (!envId && !storedId) {
        setConfigProvider('google-drive');
        setShowClientIdModal(true);
        return;
      }
    } else if (providerName === 'dropbox') {
      const envKey = (import.meta as any).env?.VITE_DROPBOX_APP_KEY;
      const storedKey = localStorage.getItem('SHgestions_dropbox_app_key');
      if (!envKey && !storedKey) {
        setConfigProvider('dropbox');
        setShowClientIdModal(true);
        return;
      }
    } else if (providerName === 'onedrive') {
      const envId = (import.meta as any).env?.VITE_ONEDRIVE_CLIENT_ID;
      const storedId = localStorage.getItem('SHgestions_onedrive_client_id');
      if (!envId && !storedId) {
        setConfigProvider('onedrive');
        setShowClientIdModal(true);
        return;
      }
    }

    setConnecting(true);
    try {
      const result = await cloudService.connect(providerName as any);
      if (result.success) {
        addToast('success', t('connectedSuccess'));
      } else {
        addToast('error', result.error || 'Error de connexió');
      }
    } catch (error) {
      addToast('error', 'Error inesperat de connexió');
    } finally {
      setConnecting(false);
      loadState();
    }
  };

  const handleDisconnect = async () => {
    try {
      await cloudService.disconnect();
      addToast('info', t('disconnectedInfo'));
    } catch {
      addToast('error', 'Error en desconnectar');
    }
    loadState();
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncEngine.syncAll();
      if (result.success) {
        addToast('success', result.message);
      } else {
        addToast('warning', result.message);
      }
    } catch (error) {
      addToast('error', 'Error de sincronització');
    } finally {
      setSyncing(false);
      loadState();
    }
  };

  const handleRetryErrors = async () => {
    setSyncing(true);
    try {
      const retried = await syncEngine.retryErrors();
      addToast('info', `${retried} elements reintentats`);
    } catch {
      addToast('error', 'Error en reintentar');
    } finally {
      setSyncing(false);
      loadState();
    }
  };

  const handleSaveClientId = () => {
    if (clientId.trim()) {
      const keyMap: Record<string, string> = {
        'google-drive': 'SHgestions_google_client_id',
        'dropbox': 'SHgestions_dropbox_app_key',
        'onedrive': 'SHgestions_onedrive_client_id',
      };
      localStorage.setItem(keyMap[configProvider] || keyMap['google-drive'], clientId.trim());
      setShowClientIdModal(false);
      setClientId('');
      addToast('success', t('clientIdSaved'));
    }
  };

  if (loading) return <LoadingSpinner text="Carregant configuració…" />;

  const isConnected = connection?.connected || false;

  return (
    <div className="animate-fade-in space-y-4">
      <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">
        Configuració del núvol
      </h2>

      {/* Connection status */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">{t('connectionStatus')}</p>
          <Badge variant={isConnected ? 'success' : 'neutral'} size="md">
            {isConnected ? 'Connectat' : 'Desconnectat'}
          </Badge>
        </div>

        {isConnected && connection ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                {connection?.provider === "google-drive" ? <GoogleDriveLogo size={28} /> : connection?.provider === "dropbox" ? <DropboxLogo size={28} /> : <OneDriveLogo size={28} />}
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                  {providers.find(p => p.name === connection.provider)?.displayName || connection.provider}
                </p>
                {connection.userEmail && (
                  <p className="text-xs text-surface-500">{connection.userEmail}</p>
                )}
                {connection.userName && (
                  <p className="text-xs text-surface-400">{connection.userName}</p>
                )}
              </div>
            </div>

            {connection.lastSyncAt && (
              <p className="text-xs text-surface-400">
                {t('cloudLastSync')}: {new Date(connection.lastSyncAt).toLocaleString()}
              </p>
            )}

            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={handleSync}
                loading={syncing}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sincronitzar ara
              </Button>
              <Button variant="danger" size="sm" onClick={handleDisconnect}>
                Desconnectar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-surface-500">
            Connecta un servei al núvol per fer còpies de seguretat i sincronitzar les teves dades.
          </p>
        )}
      </Card>

      {/* Provider selection */}
      {!isConnected && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider px-1">
            Proveïdors disponibles
          </p>
          {providers.map(provider => (
            <Card key={provider.name} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {provider.name === "google-drive" ? <GoogleDriveLogo size={32} /> : provider.name === "dropbox" ? <DropboxLogo size={32} /> : <OneDriveLogo size={32} />}
                  <div>
                    <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                      {provider.displayName}
                    </p>
                    <p className="text-xs text-surface-400">
                      {provider.available ? t('cloudAvailable') : t('comingSoon')}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={provider.available ? 'primary' : 'secondary'}
                  disabled={!provider.available || connecting}
                  loading={connecting}
                  onClick={() => handleConnect(provider.name)}
                >
                  Connectar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Sync stats */}
      {stats && (
        <Card className="p-5">
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">
            Estat de sincronització
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-surface-50 dark:bg-surface-900 rounded-xl">
              <p className="text-2xl font-bold text-amber-500">{stats.totalPending}</p>
              <p className="text-[10px] uppercase tracking-wider text-surface-400 font-semibold mt-1">{t('pendingItems')}</p>
            </div>
            <div className="text-center p-3 bg-surface-50 dark:bg-surface-900 rounded-xl">
              <p className="text-2xl font-bold text-emerald-500">{stats.totalSynced}</p>
              <p className="text-[10px] uppercase tracking-wider text-surface-400 font-semibold mt-1">{t('synced')}</p>
            </div>
            <div className="text-center p-3 bg-surface-50 dark:bg-surface-900 rounded-xl">
              <p className="text-2xl font-bold text-red-500">{stats.totalErrors}</p>
              <p className="text-[10px] uppercase tracking-wider text-surface-400 font-semibold mt-1">{t('errors')}</p>
            </div>
            <div className="text-center p-3 bg-surface-50 dark:bg-surface-900 rounded-xl">
              <p className="text-2xl font-bold text-surface-500">{stats.totalConflicts}</p>
              <p className="text-[10px] uppercase tracking-wider text-surface-400 font-semibold mt-1">{t('conflicts')}</p>
            </div>
          </div>

          {stats.lastSyncAt && (
            <p className="text-xs text-surface-400 text-center mt-3">
              {t('cloudLastSync')}: {new Date(stats.lastSyncAt).toLocaleString()}
            </p>
          )}

          {stats.totalErrors > 0 && (
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" size="sm" fullWidth onClick={() => setShowErrorsModal(true)}>
                Veure errors
              </Button>
              <Button variant="secondary" size="sm" fullWidth onClick={handleRetryErrors} loading={syncing}>
                Reintentar
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Info card */}
      <Card className="p-4">
        <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
          Com funciona
        </p>
        <div className="text-xs text-surface-500 dark:text-surface-400 space-y-1.5">
          <p>• {t('cloudHow1')}</p>
          <p>• {t('cloudHow2')}</p>
          <p>• {t('cloudHow3')}</p>
          <p>• {t('cloudHow4')}</p>
          <p>• {t('cloudHow5')}</p>
        </div>
      </Card>

      {/* Client ID Modal */}
      <Modal
        isOpen={showClientIdModal}
        onClose={() => setShowClientIdModal(false)}
        title="Configura Google Drive"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="text-sm text-surface-600 dark:text-surface-400 space-y-2">
            <p>Per connectar Google Drive necessites un <strong>Client ID</strong> de Google.</p>
            <p>Segueix els passos del README o demana ajuda per configurar-ho.</p>
          </div>

          <Input
            label={configProvider === 'dropbox' ? 'Dropbox App Key' : configProvider === 'onedrive' ? 'OneDrive Client ID' : 'Google Client ID'}
            value={clientId}
            onChange={e => setClientId(e.target.value)}
            placeholder={configProvider === 'dropbox' ? 'xxxxxxxxxxxx' : configProvider === 'onedrive' ? 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' : 'xxxxxxxxxxxx.apps.googleusercontent.com'}
            hint="El trobaràs a Google Cloud Console → Credencials"
          />

          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setShowClientIdModal(false)}>
              Cancel·lar
            </Button>
            <Button fullWidth onClick={handleSaveClientId} disabled={!clientId.trim()}>
              Guardar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Errors Modal */}
      <Modal
        isOpen={showErrorsModal}
        onClose={() => setShowErrorsModal(false)}
        title={t('cloudSyncErrorsTitle')}
        maxWidth="max-w-md"
      >
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {errorItems.length === 0 ? (
            <p className="text-sm text-surface-400 text-center py-4">{t('noErrors')}</p>
          ) : (
            errorItems.map(item => (
              <div key={item.id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="danger">{item.entityType}</Badge>
                  <span className="text-[10px] text-surface-400">Intent {item.retryCount}/{item.maxRetries}</span>
                </div>
                <p className="text-xs text-red-600 dark:text-red-400">{item.errorMessage}</p>
                <p className="text-[10px] text-surface-400 mt-1">ID: {item.entityId.substring(0, 8)}…</p>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}
