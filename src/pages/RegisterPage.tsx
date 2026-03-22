import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/i18n';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addToast } = useToast();
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!username.trim() || username.trim().length < 3) { setError(t('registerErrorUsername')); return; }
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) { setError(t('registerErrorPin')); return; }
    if (pin !== pinConfirm) { setError(t('registerErrorPinMatch')); return; }
    setLoading(true);
    try {
      const result = await register(username.trim(), displayName.trim(), pin);
      if (result.success) { addToast('success', t('registerSuccess')); }
      else { setError(t(result.error || 'registerErrorGeneric')); }
    } catch { setError(t('registerErrorGeneric')); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4">
      <button onClick={toggleTheme} className="fixed top-4 right-4 p-2.5 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm" aria-label={isDark ? t('themeLight') : t('themeDark')}>
        {isDark ? <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        : <svg className="w-5 h-5 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>}
      </button>
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-600/20"><span className="text-white text-2xl font-bold">€</span></div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">{t('registerTitle')}</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{t('registerSubtitle')}</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 shadow-sm space-y-4">
          <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">{t('registerUsername')}</label>
            <input type="text" value={username} onChange={e=>{setUsername(e.target.value);setError('');}} placeholder={t('registerUsernamePlaceholder')} autoComplete="username" autoCapitalize="none" className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 text-base"/></div>
          <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">{t('registerDisplayName')}</label>
            <input type="text" value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder={t('registerDisplayNamePlaceholder')} className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 text-base"/></div>
          <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">{t('registerPin')}</label>
            <input type="password" inputMode="numeric" pattern="[0-9]*" maxLength={4} value={pin} onChange={e=>{setPin(e.target.value.replace(/\D/g,'').slice(0,4));setError('');}} placeholder="••••" className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 text-base text-center tracking-[0.5em]"/></div>
          <div><label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">{t('registerPinConfirm')}</label>
            <input type="password" inputMode="numeric" pattern="[0-9]*" maxLength={4} value={pinConfirm} onChange={e=>{setPinConfirm(e.target.value.replace(/\D/g,'').slice(0,4));setError('');}} placeholder="••••" className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 text-base text-center tracking-[0.5em]"/></div>
          {error && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"><p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">{error}</p></div>}
          <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-base shadow-sm disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {loading ? <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>{t('registerCreating')}</> : t('registerSubmit')}
          </button>
          <p className="text-center text-sm text-surface-500">{t('registerHasAccount')}{' '}<button type="button" onClick={()=>navigate('/login')} className="text-brand-600 font-semibold hover:underline">{t('registerLogin')}</button></p>
        </form>
      </div>
    </div>
  );
}
