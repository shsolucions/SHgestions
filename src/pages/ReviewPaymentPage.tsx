import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { paymentService } from '@/services/paymentService';
import { useToast } from '@/context/ToastContext';
import { checkForDuplicates } from '@/utils/duplicateDetector';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { getTodayISO, getCurrentTime } from '@/utils/formatters';
import type { PaymentMethod, OcrResult, ReviewStatus } from '@/types';
import { useTranslation } from '@/i18n';

interface LocationState {
  images?: {
    id: string;
    file: File;
    preview: string;
    pageType: string;
    ocrResult?: OcrResult;
  }[];
  mergedOcr?: OcrResult;
  // For editing existing records
  editRecordId?: string;
}

export function ReviewPaymentPage() {
  const navigate = useNavigate();
  const { id: loanId } = useParams<{ id: string }>();
  const location = useLocation();
  const { addToast } = useToast();
  const { t } = useTranslation();
  const state = (location.state as LocationState) || {};

  const images = state.images || [];
  const mergedOcr = state.mergedOcr;

  // Form state pre-filled from OCR
  const [paymentDate, setPaymentDate] = useState(mergedOcr?.parsedData?.date || getTodayISO());
  const [paymentTime, setPaymentTime] = useState(mergedOcr?.parsedData?.time || getCurrentTime());
  const [amount, setAmount] = useState(mergedOcr?.parsedData?.amount ? String(mergedOcr.parsedData.amount) : '');
  const [currency, setCurrency] = useState(mergedOcr?.parsedData?.currency || 'EUR');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(mergedOcr?.parsedData?.paymentMethod || 'ingrés');
  const [senderName, setSenderName] = useState(mergedOcr?.parsedData?.senderName || '');
  const [concept, setConcept] = useState(mergedOcr?.parsedData?.concept || '');
  const [bankName, setBankName] = useState(mergedOcr?.parsedData?.bankName || '');
  const [ibanMasked, setIbanMasked] = useState(mergedOcr?.parsedData?.ibanMasked || '');
  const [operationCode, setOperationCode] = useState(mergedOcr?.parsedData?.operationCode || '');
  const [referenceCode, setReferenceCode] = useState(mergedOcr?.parsedData?.referenceCode || '');
  const [notes, setNotes] = useState('');
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>('pendent');

  const [saving, setSaving] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState<string | null>(null);

  const ocrRawText = mergedOcr?.rawText || '';
  const ocrConfidence = mergedOcr?.confidence || 0;

  // Check for duplicates when date or amount changes
  useEffect(() => {
    const check = async () => {
      if (loanId && paymentDate && amount && parseFloat(amount) > 0) {
        const result = await checkForDuplicates(loanId, paymentDate, parseFloat(amount));
        setDuplicateWarning(result.isDuplicate ? result.reason : '');
      } else {
        setDuplicateWarning('');
      }
    };
    check();
  }, [loanId, paymentDate, amount]);

  const handleSave = async (status: ReviewStatus) => {
    if (!loanId) return;

    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      addToast('error', t('amountMustBePositive'));
      return;
    }
    if (!paymentDate) {
      addToast('error', t('dateRequired'));
      return;
    }

    setSaving(true);
    try {
      // Create payment record
      const record = await paymentService.create({
        loanId,
        paymentDate,
        paymentTime,
        amount: parsedAmount,
        currency,
        paymentMethod,
        senderName: senderName.trim(),
        concept: concept.trim(),
        bankName: bankName.trim(),
        ibanMasked: ibanMasked.trim(),
        operationCode: operationCode.trim(),
        referenceCode: referenceCode.trim(),
        ocrRawText,
        ocrConfidence,
        reviewStatus: status,
        notes: notes.trim(),
      });

      // Save attachments
      for (const img of images) {
        if (img.file) {
          await paymentService.addAttachment(
            {
              paymentRecordId: record.id,
              fileName: img.file.name,
              mimeType: img.file.type,
              localBlobRef: '', // Will be set by the service
              pageType: img.pageType as any,
            },
            img.file
          );
        }
      }

      addToast('success', status === 'revisat' ? t('recordAccepted') : t('recordSavedPending'));
      navigate(`/loans/${loanId}`, { replace: true });
    } catch (error) {
      console.error('Error saving payment:', error);
      addToast('error', t('errorSavingRecord'));
    } finally {
      setSaving(false);
    }
  };

  const confidenceColor =
    ocrConfidence >= 80 ? 'text-emerald-600' : ocrConfidence >= 50 ? 'text-amber-600' : 'text-red-600';
  const confidenceBg =
    ocrConfidence >= 80
      ? 'bg-emerald-50 dark:bg-emerald-900/20'
      : ocrConfidence >= 50
        ? 'bg-amber-50 dark:bg-amber-900/20'
        : 'bg-red-50 dark:bg-red-900/20';

  return (
    <div className="animate-fade-in space-y-4">
      <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">{t('reviewRecord')}</h2>

      {/* Duplicate warning */}
      {duplicateWarning && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <span className="text-amber-500 text-lg">⚠</span>
            <div>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">{t('possibleDuplicate')}</p>
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">{duplicateWarning}</p>
            </div>
          </div>
        </div>
      )}

      {/* Image thumbnails */}
      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setShowImageModal(img.preview)}
              className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 border-surface-200 dark:border-surface-600 hover:border-brand-400 transition-colors"
            >
              <img src={img.preview} alt={`Rebut ${i + 1}`} className="w-full h-full object-cover" />
              <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] text-center py-0.5 font-semibold uppercase">
                {img.pageType}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* OCR confidence indicator */}
      {ocrRawText && (
        <Card className={`p-3 ${confidenceBg}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${confidenceColor}`}>{ocrConfidence}%</span>
              <span className="text-xs text-surface-600 dark:text-surface-400">{t('ocrConfidence')}</span>
            </div>
            <button
              onClick={() => setShowOcrModal(true)}
              className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
            >
              Veure text OCR
            </button>
          </div>
        </Card>
      )}

      {/* Editable form */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5 space-y-4">
        <p className="text-xs text-surface-400 font-semibold uppercase tracking-wider">{t('paymentData')}</p>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t('formDate')}
            type="date"
            value={paymentDate}
            onChange={e => setPaymentDate(e.target.value)}
          />
          <Input
            label={t('formTime')}
            type="time"
            value={paymentTime}
            onChange={e => setPaymentTime(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t('formAmount')}
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0,00"
          />
          <Select
            label={t('formCurrency')}
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            options={[
              { value: 'EUR', label: 'EUR (€)' },
              { value: 'USD', label: 'USD ($)' },
              { value: 'GBP', label: 'GBP (£)' },
            ]}
          />
        </div>

        <Select
          label={t('formPaymentMethod')}
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
          options={[
            { value: 'efectiu', label: t('methodCash') },
            { value: 'transferència', label: t('methodTransfer') },
            { value: 'bizum', label: t('methodBizum') },
            { value: 'ingrés', label: t('methodDeposit') },
            { value: 'altre', label: t('methodOther') },
          ]}
        />

        <Input
          label={t('formSender')}
          value={senderName}
          onChange={e => setSenderName(e.target.value)}
          placeholder={t('formSenderPlaceholder')}
        />

        <Input
          label={t('formConcept')}
          value={concept}
          onChange={e => setConcept(e.target.value)}
          placeholder={t('formConceptPlaceholder')}
        />

        <Input
          label={t('formBank')}
          value={bankName}
          onChange={e => setBankName(e.target.value)}
          placeholder={t('formBankPlaceholder')}
        />

        <Input
          label={t('formIban')}
          value={ibanMasked}
          onChange={e => setIbanMasked(e.target.value)}
          placeholder={t('formIbanPlaceholder')}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t('formOpCode')}
            value={operationCode}
            onChange={e => setOperationCode(e.target.value)}
            placeholder={t('formOpCodePlaceholder')}
          />
          <Input
            label={t('formRef')}
            value={referenceCode}
            onChange={e => setReferenceCode(e.target.value)}
            placeholder={t('formRefPlaceholder')}
          />
        </div>

        <TextArea
          label={t('formNotesPayment')}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder={t('formNotesPaymentPlaceholder')}
          rows={2}
        />
      </div>

      {/* Action buttons */}
      <div className="space-y-2 pt-2">
        <Button fullWidth onClick={() => handleSave('revisat')} loading={saving}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Acceptar i guardar
        </Button>
        <Button variant="secondary" fullWidth onClick={() => handleSave('pendent')} loading={saving}>
          Guardar com a pendent
        </Button>
        <Button variant="ghost" fullWidth onClick={() => navigate(-1)} disabled={saving}>
          Tornar enrere
        </Button>
      </div>

      {/* OCR text modal */}
      <Modal isOpen={showOcrModal} onClose={() => setShowOcrModal(false)} title={t('fullOcrText')} maxWidth="max-w-lg">
        <div className="bg-surface-50 dark:bg-surface-900 rounded-xl p-4 max-h-80 overflow-y-auto">
          <pre className="text-xs font-mono text-surface-700 dark:text-surface-300 whitespace-pre-wrap break-words">
            {ocrRawText || 'No s\'ha detectat text.'}
          </pre>
        </div>
      </Modal>

      {/* Image preview modal */}
      <Modal isOpen={!!showImageModal} onClose={() => setShowImageModal(null)} maxWidth="max-w-xl">
        {showImageModal && (
          <img src={showImageModal} alt="Rebut" className="w-full rounded-xl" />
        )}
      </Modal>
    </div>
  );
}
