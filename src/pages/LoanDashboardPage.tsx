import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loanService } from '@/services/loanService';
import { paymentService } from '@/services/paymentService';
import { useToast } from '@/context/ToastContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LoadingSpinner } from '@/components/ui/EmptyState';
import { formatCurrency, formatDate, translatePaymentMethod, translateStatus } from '@/utils/formatters';
import { exportService } from '@/services/exportService';
import type { Loan, PaymentRecord } from '@/types';
import { useTranslation } from '@/i18n';

export function LoanDashboardPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [loan, setLoan] = useState<Loan | null>(null);
  const [totalRepaid, setTotalRepaid] = useState(0);
  const [lastPayment, setLastPayment] = useState<PaymentRecord | null>(null);
  const [paymentCount, setPaymentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [loanData, repaid, last, count] = await Promise.all([
        loanService.getById(id),
        loanService.getTotalRepaid(id),
        paymentService.getLastPayment(id),
        loanService.getPaymentCount(id),
      ]);
      setLoan(loanData);
      setTotalRepaid(repaid);
      setLastPayment(last);
      setPaymentCount(count);
    } catch (error) {
      console.error('Error loading loan dashboard:', error);
      addToast('error', 'Error carregant el préstec');
    } finally {
      setLoading(false);
    }
  }, [id, addToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await loanService.delete(id);
      addToast('success', t('loanDeleted'));
      navigate('/loans', { replace: true });
    } catch {
      addToast('error', t('unexpectedError'));
    }
  };

  if (loading) return <LoadingSpinner text={t('loadingDashboard')} />;
  if (!loan) {
    return (
      <div className="text-center py-12">
        <p className="text-surface-500">{t('loanNotFound')}</p>
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/loans')}>
          Tornar als préstecs
        </Button>
      </div>
    );
  }

  const pending = Math.max(0, loan.principalAmount - totalRepaid);
  const progress = loan.principalAmount > 0
    ? Math.min(100, (totalRepaid / loan.principalAmount) * 100)
    : 0;

  const statusVariant = loan.status === 'actiu' ? 'success' : loan.status === 'pausat' ? 'warning' : 'neutral';

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">{loan.name}</h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
            {loan.borrowerName} → {loan.lenderName}
          </p>
        </div>
        <Badge variant={statusVariant} size="md">{translateStatus(loan.status)}</Badge>
      </div>

      {/* Two big cards side by side */}
      <div className="grid grid-cols-2 gap-3">
        {/* PENDENT */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 text-white shadow-lg shadow-red-500/20">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{t('pending')}</p>
          <p className="text-2xl font-bold mt-1 leading-tight">
            {formatCurrency(pending, loan.currency)}
          </p>
          <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/60 rounded-full transition-all duration-700"
              style={{ width: `${100 - progress}%` }}
            />
          </div>
        </div>

        {/* TOTAL INGRESSAT */}
        <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-4 text-white shadow-lg shadow-brand-500/20">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{t('totalDeposited')}</p>
          <p className="text-2xl font-bold mt-1 leading-tight">
            {formatCurrency(totalRepaid, loan.currency)}
          </p>
          <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/60 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Import prestat info */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-surface-400 font-semibold uppercase tracking-wider">{t('lentAmountLabel')}</p>
            <p className="text-lg font-bold text-surface-900 dark:text-surface-100">
              {formatCurrency(loan.principalAmount, loan.currency)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-surface-400 font-semibold uppercase tracking-wider">Progres</p>
            <p className="text-lg font-bold text-brand-600">{progress.toFixed(1)}%</p>
          </div>
        </div>
      </Card>

      {/* Last payment */}
      <Card className="p-4">
        <p className="text-xs text-surface-400 font-semibold uppercase tracking-wider mb-3">{t('lastDeposit')}</p>
        {lastPayment ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-surface-900 dark:text-surface-100">
                {formatCurrency(lastPayment.amount, lastPayment.currency)}
              </span>
              <Badge
                variant={lastPayment.reviewStatus === 'revisat' ? 'success' : lastPayment.reviewStatus === 'rebutjat' ? 'danger' : 'warning'}
              >
                {translateStatus(lastPayment.reviewStatus)}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-surface-500">
              <span>{formatDate(lastPayment.paymentDate)}</span>
              <span>{translatePaymentMethod(lastPayment.paymentMethod)}</span>
            </div>
            {lastPayment.concept && (
              <p className="text-xs text-surface-400 truncate">{lastPayment.concept}</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-surface-400 italic">{t('noDepositsYet')}</p>
        )}
      </Card>

      {/* Info detail */}
      {loan.notes && (
        <Card className="p-4">
          <p className="text-xs text-surface-400 font-semibold uppercase tracking-wider mb-1">{t('notes')}</p>
          <p className="text-sm text-surface-600 dark:text-surface-400">{loan.notes}</p>
        </Card>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 text-center">
          <p className="text-xs text-surface-400 font-semibold">{t('movements')}</p>
          <p className="text-xl font-bold text-surface-900 dark:text-surface-100">{paymentCount}</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xs text-surface-400 font-semibold">{t('startDate')}</p>
          <p className="text-sm font-bold text-surface-900 dark:text-surface-100">{formatDate(loan.startDate)}</p>
        </Card>
      </div>

      {/* Action buttons */}
      <div className="space-y-2">
        <Button fullWidth onClick={() => navigate(`/loans/${id}/new-payment`)}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('addRecord')}
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" fullWidth onClick={() => navigate(`/loans/${id}/history`)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('history')}
          </Button>
          <Button variant="secondary" fullWidth onClick={() => navigate(`/loans/${id}/edit`)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="secondary" fullWidth onClick={() => navigate(`/loans/${id}/charts`)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Gràfics
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={async () => {
              try {
                await exportService.exportLoanToPdf(id!);
                addToast('success', t('pdfExported'));
              } catch { addToast('error', t('exportError')); }
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            PDF
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={async () => {
              try {
                await exportService.exportLoanToExcel(id!);
                addToast('success', t('excelExported'));
              } catch { addToast('error', t('exportError')); }
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </Button>
        </div>
        <Button
          variant="ghost"
          fullWidth
          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => setShowDeleteConfirm(true)}
        >
          {t('deleteLoan')}
        </Button>
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title={t('deleteLoan') + '?'}
        message={t('deleteLoanConfirm').replace('{name}', loan.name)}
        confirmText={t('confirm')}
      />
    </div>
  );
}
