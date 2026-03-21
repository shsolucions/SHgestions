import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/i18n';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { document.getElementById('login-username')?.focus(); }, []);

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;
    const newPin = [...pin]; newPin[index] = value; setPin(newPin); setError('');
    if (value && index < 3) pinRefs.current[index + 1]?.focus();
    if (value && index === 3 && newPin.every(d => d !== '')) handleSubmit(newPin.join(''));
  };
  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) pinRefs.current[index - 1]?.focus();
  };
  const handlePinPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length === 4) { setPin(pasted.split('')); pinRefs.current[3]?.focus(); handleSubmit(pasted); }
  };

  const handleSubmit = async (pinValue?: string) => {
    const finalPin = pinValue || pin.join('');
    if (!username.trim()) { setError(t('loginErrorUser')); return; }
    if (finalPin.length !== 4) { setError(t('loginErrorPin')); return; }
    setLoading(true); setError('');
    try {
      const success = await login(username.trim().toLowerCase(), finalPin);
      if (success) { addToast('success', t('loginSuccess')); }
      else { setError(t('loginErrorInvalid')); setPin(['', '', '', '']); pinRefs.current[0]?.focus(); }
    } catch { setError(t('loginErrorGeneric')); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4">
      <button onClick={toggleTheme} className="fixed top-4 right-4 p-2.5 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm" aria-label={isDark ? t('themeLight') : t('themeDark')}>
        {isDark ? <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        : <svg className="w-5 h-5 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>}
      </button>
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-600/20"><span className="text-white text-2xl font-bold">€</span></div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">SH<span className="text-brand-600">gestions</span></h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{t('appDescription')}</p>
        </div>
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 shadow-sm">
          <div className="mb-6">
            <label htmlFor="login-username" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">{t('loginUser')}</label>
            <input id="login-username" type="text" value={username} onChange={e => { setUsername(e.target.value); setError(''); }} placeholder={t('loginUserPlaceholder')} autoComplete="username" autoCapitalize="none" className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 text-base transition-colors"/>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">{t('loginPin')}</label>
            <div className="flex gap-3 justify-center" onPaste={handlePinPaste}>
              {pin.map((digit, i) => (
                <input key={i} ref={el => { pinRefs.current[i] = el; }} type="password" inputMode="numeric" pattern="[0-9]*" maxLength={1} value={digit} onChange={e => handlePinChange(i, e.target.value)} onKeyDown={e => handlePinKeyDown(i, e)} className="w-14 h-14 text-center text-2xl font-bold rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-colors" aria-label={`PIN ${i + 1}`}/>
              ))}
            </div>
          </div>
          {error && <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"><p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">{error}</p></div>}
          <button onClick={() => handleSubmit()} disabled={loading} className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-base shadow-sm disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {loading ? <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>{t('loginEntering')}</> : t('loginEnter')}
          </button>
          <p className="text-center text-xs text-surface-400 mt-4">{t('loginDefault')}</p>
          <p className="text-center text-sm text-surface-500 mt-3">{t('loginNoAccount')}{' '}<button type="button" onClick={() => navigate('/register')} className="text-brand-600 font-semibold hover:underline">{t('loginCreateAccount')}</button></p>
        </div>
      </div>
    </div>
  );
}
