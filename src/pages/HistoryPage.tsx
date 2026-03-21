import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { paymentService } from '@/services/paymentService';
import { loanService } from '@/services/loanService';
import { useToast } from '@/context/ToastContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState, LoadingSpinner } from '@/components/ui/EmptyState';
import { formatCurrency, formatDate, translatePaymentMethod, translateStatus, truncate } from '@/utils/formatters';
import type { PaymentRecord, Loan } from '@/types';
import { useTranslation } from '@/i18n';

const statusBadge: Record<string, 'success' | 'warning' | 'danger'> = {
  revisat: 'success',
  pendent: 'warning',
  rebutjat: 'danger',
};

export function HistoryPage() {
  const navigate = useNavigate();
  const { id: loanId } = useParams<{ id: string }>();
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [loan, setLoan] = useState<Loan | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [attachmentCounts, setAttachmentCounts] = useState<Map<string, number>>(new Map());

  const loadData = useCallback(async () => {
    if (!loanId) return;
    setLoading(true);
    try {
      const [loanData, paymentData] = await Promise.all([
        loanService.getById(loanId),
        paymentService.getByLoanId(loanId),
      ]);
      setLoan(loanData);
      setPayments(paymentData);
      setFilteredPayments(paymentData);

      // Load attachment counts
      const counts = new Map<string, number>();
      for (const p of paymentData) {
        const atts = await paymentService.getAttachments(p.id);
        counts.set(p.id, atts.length);
      }
      setAttachmentCounts(counts);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  }, [loanId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Apply filters
  useEffect(() => {
    let result = [...payments];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.concept.toLowerCase().includes(q) ||
          p.senderName.toLowerCase().includes(q) ||
          p.bankName.toLowerCase().includes(q) ||
          String(p.amount).includes(q)
      );
    }

    if (dateFrom) {
      result = result.filter(p => p.paymentDate >= dateFrom);
    }
    if (dateTo) {
      result = result.filter(p => p.paymentDate <= dateTo);
    }

    // Sort by date descending
    result.sort((a, b) => b.paymentDate.localeCompare(a.paymentDate));
    setFilteredPayments(result);
  }, [payments, search, dateFrom, dateTo]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await paymentService.delete(deleteTarget);
      addToast('success', t('recordDeleted'));
      setDeleteTarget(null);
      loadData();
    } catch {
      addToast('error', 'Error eliminant el registre');
    }
  };

  const handleMarkReviewed = async (paymentId: string) => {
    try {
      await paymentService.update(paymentId, { reviewStatus: 'revisat' });
      addToast('success', t('markedReviewed'));
      loadData();
    } catch {
      addToast('error', 'Error actualitzant el registre');
    }
  };

  const totalFiltered = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  if (loading) return <LoadingSpinner text="Carregant historial…" />;

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">{t('history')}</h2>
        {loan && (
          <p className="text-sm text-surface-500 dark:text-surface-400">{loan.name}</p>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('search')}
          className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-colors"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
            showFilters ? 'bg-brand-100 text-brand-600' : 'hover:bg-surface-100 text-surface-400'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>

      {/* Date filters */}
      {showFilters && (
        <Card className="p-4 animate-slide-down">
          <p className="text-xs font-semibold text-surface-400 uppercase mb-3">{t('filters')}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-surface-500 mb-1">{t('dateFrom')}</label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </div>
            <div>
              <label className="block text-xs text-surface-500 mb-1">{t('dateTo')}</label>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </div>
          </div>
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); }}
              className="mt-2 text-xs text-brand-600 font-semibold hover:underline"
            >
              Netejar filtres
            </button>
          )}
        </Card>
      )}

      {/* Summary */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-surface-400">
          {filteredPayments.length} registre{filteredPayments.length !== 1 ? 's' : ''}
        </span>
        <span className="text-xs font-semibold text-surface-600 dark:text-surface-400">
          Total: {formatCurrency(totalFiltered)}
        </span>
      </div>

      {/* Payment list */}
      {filteredPayments.length === 0 ? (
        <EmptyState
          icon="📄"
          title={t('noRecordsFound')}
          description={payments.length === 0 ? t('noRecordsYetDesc') : t('tryOtherFilters')}
        >
          {payments.length === 0 && (
            <Button size="sm" onClick={() => navigate(`/loans/${loanId}/new-payment`)}>
              {t('addRecord')}
            </Button>
          )}
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {filteredPayments.map(payment => {
            const attCount = attachmentCounts.get(payment.id) || 0;

            return (
              <Card key={payment.id} className="p-4">
                {/* Header row */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-surface-900 dark:text-surface-100">
                        {formatCurrency(payment.amount, payment.currency)}
                      </span>
                      <Badge variant={statusBadge[payment.reviewStatus] || 'warning'}>
                        {translateStatus(payment.reviewStatus)}
                      </Badge>
                    </div>
                    <p className="text-xs text-surface-500 mt-0.5">
                      {formatDate(payment.paymentDate)} · {translatePaymentMethod(payment.paymentMethod)}
                    </p>
                  </div>
                </div>

                {/* Details */}
                {payment.concept && (
                  <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">
                    {truncate(payment.concept, 80)}
                  </p>
                )}
                {payment.bankName && (
                  <p className="text-xs text-surface-400">
                    {payment.bankName}{payment.senderName ? ` · ${payment.senderName}` : ''}
                  </p>
                )}

                {/* Attachment indicator */}
                {attCount > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    <svg className="w-3.5 h-3.5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="text-xs text-surface-400">{attCount} imatge{attCount > 1 ? 's' : ''}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-surface-100 dark:border-surface-700">
                  <button
                    onClick={() => navigate(`/loans/${loanId}/payment/${payment.id}`)}
                    className="flex-1 text-xs font-semibold text-brand-600 dark:text-brand-400 py-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                  >
                    Detall
                  </button>
                  {payment.reviewStatus === 'pendent' && (
                    <button
                      onClick={() => handleMarkReviewed(payment.id)}
                      className="flex-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                    >
                      Revisar ✓
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTarget(payment.id)}
                    className="flex-1 text-xs font-semibold text-red-500 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Esborrar
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('deleteRecord')}
        message="S'eliminaran el registre i totes les seves imatges. Aquesta acció no es pot desfer."
        confirmText="Sí, esborrar"
      />
    </div>
  );
}
