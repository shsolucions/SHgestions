/**
 * Format amount in European currency format: 1.234,56 €
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('ca-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date: dd/mm/yyyy
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('ca-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Format date + time
 */
export function formatDateTime(dateStr: string, timeStr?: string): string {
  if (!dateStr) return '—';
  const datePart = formatDate(dateStr);
  if (timeStr) return `${datePart} ${timeStr}`;
  return datePart;
}

/**
 * Get today in YYYY-MM-DD format
 */
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get current time in HH:MM format
 */
export function getCurrentTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

/**
 * Translate payment method to Catalan
 */
export function translatePaymentMethod(method: string): string {
  const map: Record<string, string> = {
    efectiu: 'Efectiu',
    transferència: 'Transferència',
    bizum: 'Bizum',
    ingrés: 'Ingrés bancari',
    altre: 'Altre',
  };
  return map[method] || method;
}

/**
 * Translate loan status to Catalan
 */
export function translateStatus(status: string): string {
  const map: Record<string, string> = {
    actiu: 'Actiu',
    finalitzat: 'Finalitzat',
    pausat: 'Pausat',
    pendent: 'Pendent',
    revisat: 'Revisat',
    rebutjat: 'Rebutjat',
  };
  return map[status] || status;
}

/**
 * Parse European amount string (e.g., "1.234,56" or "600,00") to number
 */
export function parseEuropeanAmount(str: string): number | null {
  if (!str) return null;
  // Remove currency symbols and whitespace
  let cleaned = str.replace(/[€$£\s]/g, '').trim();
  // European format: 1.234,56 → 1234.56
  // Remove dots (thousands separator), replace comma with dot (decimal)
  if (cleaned.includes(',')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  }
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength) + '…';
}

/**
 * i18n-aware status translation
 */
export function translateStatusI18n(status: string, t: (key: string) => string): string {
  const map: Record<string, string> = {
    actiu: t('statusActive'),
    finalitzat: t('statusFinished'),
    pausat: t('statusPaused'),
    pendent: t('statusPending'),
    revisat: t('statusReviewed'),
    rebutjat: t('statusRejected'),
  };
  return map[status] || status;
}

/**
 * i18n-aware payment method translation
 */
export function translatePaymentMethodI18n(method: string, t: (key: string) => string): string {
  const map: Record<string, string> = {
    efectiu: t('methodCash'),
    transferència: t('methodTransfer'),
    bizum: t('methodBizum'),
    ingrés: t('methodDeposit'),
    altre: t('methodOther'),
  };
  return map[method] || method;
}
