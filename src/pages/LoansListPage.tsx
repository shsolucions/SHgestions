import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loanService } from '@/services/loanService';
import { exportService } from '@/services/exportService';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState, LoadingSpinner } from '@/components/ui/EmptyState';
import { formatCurrency, formatDate, translateStatus } from '@/utils/formatters';
import type { Loan } from '@/types';
import { useTranslation } from '@/i18n';

const statusBadgeVariant: Record<string, 'success' | 'warning' | 'neutral'> = {
  actiu: 'success',
  pausat: 'warning',
  finalitzat: 'neutral',
};

export function LoansListPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [totals, setTotals] = useState<Map<string, { repaid: number; count: number }>>(new Map());

  const loadLoans = useCallback(async () => {
    setLoading(true);
    try {
      const data = search
        ? await loanService.searchForUser(user!.id, search)
        : await loanService.getAllForUser(user!.id);
      setLoans(data);

      // Load totals for each loan
      const newTotals = new Map<string, { repaid: number; count: number }>();
      for (const loan of data) {
        const repaid = await loanService.getTotalRepaid(loan.id);
        const count = await loanService.getPaymentCount(loan.id);
        newTotals.set(loan.id, { repaid, count });
      }
      setTotals(newTotals);
    } catch (error) {
      console.error('Error loading loans:', error);
    } finally {
      setLoading(false);
    }
  }, [search, user]);

  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  if (loading) {
    return <LoadingSpinner text="Carregant préstecs…" />;
  }

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">
          {t("myLoans")}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={async () => {
              try {
                await exportService.exportAllToExcel();
                addToast('success', t('excelExported'));
              } catch { addToast('error', t('exportError')); }
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar
          </Button>
          <Button size="sm" onClick={() => navigate('/loans/new')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Crear
          </Button>
        </div>
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
          placeholder={t('searchLoan')}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-colors"
        />
      </div>

      {/* Loan cards */}
      {loans.length === 0 ? (
        <EmptyState
          icon="💰"
          title={t('noLoansYet')}
          description={t('noLoansDesc')}
        >
          <Button onClick={() => navigate('/loans/new')}>{t('createLoan')}</Button>
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {loans.map(loan => {
            const info = totals.get(loan.id) || { repaid: 0, count: 0 };
            const pending = loan.principalAmount - info.repaid;
            const progress = loan.principalAmount > 0
              ? Math.min(100, (info.repaid / loan.principalAmount) * 100)
              : 0;

            return (
              <Card
                key={loan.id}
                hoverable
                onClick={() => navigate(`/loans/${loan.id}`)}
                className="p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100 truncate">
                      {loan.name}
                    </h3>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                      {loan.borrowerName} → {loan.lenderName}
                    </p>
                  </div>
                  <Badge variant={statusBadgeVariant[loan.status] || 'neutral'}>
                    {translateStatus(loan.status)}
                  </Badge>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-surface-100 dark:bg-surface-700 rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-surface-400 font-semibold">{t('lentAmountLabel')}</p>
                    <p className="text-sm font-bold text-surface-900 dark:text-surface-100">
                      {formatCurrency(loan.principalAmount, loan.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-surface-400 font-semibold">{t('returned')}</p>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(info.repaid, loan.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-surface-400 font-semibold">{t('pending')}</p>
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(Math.max(0, pending), loan.currency)}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-100 dark:border-surface-700">
                  <span className="text-xs text-surface-400">
                    Inici: {formatDate(loan.startDate)}
                  </span>
                  <span className="text-xs text-surface-400">
                    {info.count} moviment{info.count !== 1 ? 's' : ''}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
