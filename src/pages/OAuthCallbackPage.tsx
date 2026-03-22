import React, { useEffect } from 'react';

/**
 * This page handles the OAuth2 redirect from Google.
 * It parses the token from the URL hash, sends it to the opener window,
 * saves it as fallback, and closes itself.
 */
export function OAuthCallbackPage() {
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const access_token = params.get('access_token');
    const expires_in = parseInt(params.get('expires_in') || '3600', 10);
    const returnedState = params.get('state');
    const error = params.get('error');

    // Send message to opener (parent window)
    if (window.opener) {
      window.opener.postMessage({
        type: 'oauth-callback',
        access_token,
        expires_in,
        returnedState,
        error: error || undefined,
      }, window.location.origin);
    }

    // Also save token directly as fallback
    if (access_token) {
      const tokenData = {
        access_token,
        expires_at: Date.now() + expires_in * 1000,
      };
      localStorage.setItem('SHgestions_gdrive_token', JSON.stringify(tokenData));
    }

    // Close popup after a short delay
    setTimeout(() => {
      window.close();
    }, 500);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
      <div className="text-center p-8">
        <div className="w-12 h-12 mx-auto mb-4">
          <svg className="animate-spin w-full h-full text-brand-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <p className="text-sm text-surface-500">Connectant amb Google Drive...</p>
        <p className="text-xs text-surface-400 mt-2">Aquesta finestra es tancarà automàticament.</p>
      </div>
    </div>
  );
}
