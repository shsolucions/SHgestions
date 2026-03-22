import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { loanService } from '@/services/loanService';
import { paymentService } from '@/services/paymentService';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner, EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatDate, translatePaymentMethod } from '@/utils/formatters';
import type { Loan, PaymentRecord } from '@/types';
import { useTranslation } from '@/i18n';

const COLORS = ['#3b91f5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function ChartsPage() {
  const { id: loanId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loanId) return;
    Promise.all([
      loanService.getById(loanId),
      paymentService.getByLoanId(loanId),
    ]).then(([l, p]) => {
      setLoan(l);
      // Sort chronologically
      p.sort((a, b) => a.paymentDate.localeCompare(b.paymentDate));
      setPayments(p.filter(x => x.reviewStatus !== 'rebutjat'));
      setLoading(false);
    });
  }, [loanId]);

  if (loading) return <LoadingSpinner text="Carregant gràfics…" />;
  if (!loan) return <EmptyState icon="📊" title={t('loanNotFound')} />;
  if (payments.length === 0) {
    return <EmptyState icon="📊" title={t('noData')} description={t('noPaymentsForCharts')} />;
  }

  // ─── Data prep ──────────────────────────────────

  // Bar chart: import per pagament
  const barData = payments.map(p => ({
    name: formatDate(p.paymentDate),
    import: p.amount,
  }));

  // Line chart: evolució acumulada
  let cumulative = 0;
  const lineData = payments.map(p => {
    cumulative += p.amount;
    return {
      name: formatDate(p.paymentDate),
      acumulat: cumulative,
      objectiu: loan.principalAmount,
    };
  });

  // Pie chart: mètode de pagament
  const methodMap = new Map<string, number>();
  for (const p of payments) {
    const label = translatePaymentMethod(p.paymentMethod);
    methodMap.set(label, (methodMap.get(label) || 0) + p.amount);
  }
  const pieData = Array.from(methodMap.entries()).map(([name, value]) => ({ name, value }));

  // Monthly summary
  const monthlyMap = new Map<string, number>();
  for (const p of payments) {
    const month = p.paymentDate.substring(0, 7); // YYYY-MM
    monthlyMap.set(month, (monthlyMap.get(month) || 0) + p.amount);
  }
  const monthlyData = Array.from(monthlyMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, total]) => {
      const [y, m] = month.split('-');
      return { name: `${m}/${y}`, total };
    });

  const totalRepaid = payments.reduce((s, p) => s + p.amount, 0);
  const progress = ((totalRepaid / loan.principalAmount) * 100).toFixed(1);

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">{t('charts')}</h2>
        <p className="text-sm text-surface-500">{loan.name}</p>
      </div>

      {/* Progress headline */}
      <Card className="p-4 text-center">
        <p className="text-3xl font-bold text-brand-600">{progress}%</p>
        <p className="text-xs text-surface-400 mt-1">
          {formatCurrency(totalRepaid)} de {formatCurrency(loan.principalAmount)} retornat
        </p>
      </Card>

      {/* Bar: Imports per pagament */}
      <Card className="p-4">
        <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">
          Import per pagament
        </p>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), t('chartsAmountLabel')]}
                contentStyle={{ borderRadius: 12, fontSize: 12 }}
              />
              <Bar dataKey="import" fill="#3b91f5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Line: Evolució acumulada */}
      <Card className="p-4">
        <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">
          Evolució acumulada vs objectiu
        </p>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === 'acumulat' ? t('chartsReturnedLabel') : t('chartsTargetLabel'),
                ]}
                contentStyle={{ borderRadius: 12, fontSize: 12 }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="acumulat"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 4 }}
                name={t('chartsReturnedLabel')}
              />
              <Line
                type="monotone"
                dataKey="objectiu"
                stroke="#ef4444"
                strokeWidth={1.5}
                strokeDasharray="8 4"
                dot={false}
                name={t('chartsTargetLabel')}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Bar: Resum mensual */}
      {monthlyData.length > 1 && (
        <Card className="p-4">
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">
            Resum mensual
          </p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), t('chartsMonthLabel')]}
                  contentStyle={{ borderRadius: 12, fontSize: 12 }}
                />
                <Bar dataKey="total" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Pie: Mètode de pagament */}
      <Card className="p-4">
        <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">
          Per mètode de pagament
        </p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), t('chartsTotalLabel')]}
                contentStyle={{ borderRadius: 12, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
