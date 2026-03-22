import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loanService } from '@/services/loanService';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/EmptyState';
import { getTodayISO } from '@/utils/formatters';
import type { LoanStatus } from '@/types';
import { useTranslation } from '@/i18n';

export function LoanFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('PRÉSTEC PERSONAL');
  const [lenderName, setLenderName] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [principalAmount, setPrincipalAmount] = useState('1000');
  const [currency, setCurrency] = useState('EUR');
  const [startDate, setStartDate] = useState(getTodayISO());
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<LoanStatus>('actiu');

  useEffect(() => {
    if (isEdit && id) {
      loanService.getById(id).then(loan => {
        if (loan) {
          setName(loan.name);
          setLenderName(loan.lenderName);
          setBorrowerName(loan.borrowerName);
          setPrincipalAmount(String(loan.principalAmount));
          setCurrency(loan.currency);
          setStartDate(loan.startDate);
          setNotes(loan.notes);
          setStatus(loan.status);
        }
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      addToast('error', t('loanName'));
      return;
    }
    if (!principalAmount || parseFloat(principalAmount) <= 0) {
      addToast('error', t('amountMustBePositive'));
      return;
    }

    setSaving(true);
    try {
      if (isEdit && id) {
        await loanService.update(id, {
          name: name.trim(),
          lenderName: lenderName.trim(),
          borrowerName: borrowerName.trim(),
          principalAmount: parseFloat(principalAmount),
          currency,
          startDate,
          notes: notes.trim(),
          status,
        });
        addToast('success', t('loanUpdated'));
        navigate(`/loans/${id}`);
      } else {
        const loan = await loanService.create({
          userId: user!.id,
          name: name.trim(),
          lenderName: lenderName.trim(),
          borrowerName: borrowerName.trim(),
          principalAmount: parseFloat(principalAmount),
          currency,
          startDate,
          notes: notes.trim(),
          status,
        });
        addToast('success', t('loanCreated'));
        navigate(`/loans/${loan.id}`);
      }
    } catch (error) {
      addToast('error', t('unexpectedError'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Carregant préstec…" />;

  return (
    <div className="animate-fade-in space-y-5">
      <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">
        {isEdit ? t('editLoan') : t('newLoan')}
      </h2>

      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5 space-y-4">
        <Input
          label="Nom del préstec"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="p.ex. PRÉSTEC PERSONAL"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t("lender")}
            value={lenderName}
            onChange={e => setLenderName(e.target.value)}
            placeholder="Nom del prestador"
          />
          <Input
            label={t("borrower")}
            value={borrowerName}
            onChange={e => setBorrowerName(e.target.value)}
            placeholder="Nom del prestatari"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t("lentAmount")}
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={principalAmount}
            onChange={e => setPrincipalAmount(e.target.value)}
          />
          <Select
            label={t("currency")}
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            options={[
              { value: 'EUR', label: 'EUR (€)' },
              { value: 'USD', label: 'USD ($)' },
              { value: 'GBP', label: 'GBP (£)' },
            ]}
          />
        </div>

        <Input
          label={t('startDate')}
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />

        {isEdit && (
          <Select
            label={t("loanStatus")}
            value={status}
            onChange={e => setStatus(e.target.value as LoanStatus)}
            options={[
              { value: 'actiu', label: 'Actiu' },
              { value: 'pausat', label: 'Pausat' },
              { value: 'finalitzat', label: 'Finalitzat' },
            ]}
          />
        )}

        <TextArea
          label={`${t("notes")} (${t("optional")})`}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Detalls addicionals del préstec…"
          rows={3}
        />
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" fullWidth onClick={() => navigate(-1)}>
          Cancel·lar
        </Button>
        <Button fullWidth onClick={handleSubmit} loading={saving}>
          {isEdit ? t('saveChanges') : t('createLoan')}
        </Button>
      </div>
    </div>
  );
}
