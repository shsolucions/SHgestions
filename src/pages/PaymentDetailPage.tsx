import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { paymentService } from '@/services/paymentService';
import { loanService } from '@/services/loanService';
import { useToast } from '@/context/ToastContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TextArea } from '@/components/ui/TextArea';
import { LoadingSpinner } from '@/components/ui/EmptyState';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  translatePaymentMethod,
  translateStatus,
} from '@/utils/formatters';
import type { PaymentRecord, Attachment, Loan, PaymentMethod, ReviewStatus } from '@/types';
import { useTranslation } from '@/i18n';

export function PaymentDetailPage() {
  const navigate = useNavigate();
  const { id: loanId, paymentId } = useParams<{ id: string; paymentId: string }>();
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [loan, setLoan] = useState<Loan | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [showOcr, setShowOcr] = useState(false);
  const [showImageModal, setShowImageModal] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editing, setEditing] = useState(false);

  // Edit form state
  const [editData, setEditData] = useState<Partial<PaymentRecord>>({});

  const loadData = useCallback(async () => {
    if (!paymentId || !loanId) return;
    setLoading(true);
    try {
      const [paymentData, loanData, atts] = await Promise.all([
        paymentService.getById(paymentId),
        loanService.getById(loanId),
        paymentService.getAttachments(paymentId),
      ]);
      setPayment(paymentData);
      setLoan(loanData);
      setAttachments(atts);

      // Load image blobs
      const urls = new Map<string, string>();
      for (const att of atts) {
        const blob = await paymentService.getImageBlob(att.localBlobRef);
        if (blob) {
          urls.set(att.id, URL.createObjectURL(blob));
        }
      }
      setImageUrls(urls);
    } catch (error) {
      console.error('Error loading payment detail:', error);
    } finally {
      setLoading(false);
    }
  }, [paymentId, loanId]);

  useEffect(() => {
    loadData();
    return () => {
      // Cleanup blob URLs
      imageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [loadData]);

  const startEdit = () => {
    if (!payment) return;
    setEditData({
      paymentDate: payment.paymentDate,
      paymentTime: payment.paymentTime,
      amount: payment.amount,
      currency: payment.currency,
      paymentMethod: payment.paymentMethod,
      senderName: payment.senderName,
      concept: payment.concept,
      bankName: payment.bankName,
      ibanMasked: payment.ibanMasked,
      operationCode: payment.operationCode,
      referenceCode: payment.referenceCode,
      notes: payment.notes,
      reviewStatus: payment.reviewStatus,
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!paymentId) return;
    try {
      await paymentService.update(paymentId, editData);
      addToast('success', t('loanUpdated'));
      setEditing(false);
      loadData();
    } catch {
      addToast('error', t('unexpectedError'));
    }
  };

  const handleDelete = async () => {
    if (!paymentId || !loanId) return;
    try {
      await paymentService.delete(paymentId);
      addToast('success', t('recordDeleted'));
      navigate(`/loans/${loanId}/history`, { replace: true });
    } catch {
      addToast('error', 'Error eliminant el registre');
    }
  };

  if (loading) return <LoadingSpinner text={t('loadingDetail')} />;
  if (!payment) {
    return (
      <div className="text-center py-12">
        <p className="text-surface-500">{t('recordNotFound')}</p>
        <Button variant="secondary" className="mt-4" onClick={() => navigate(-1)}>{t('back')}</Button>
      </div>
    );
  }

  const statusVariant = payment.reviewStatus === 'revisat' ? 'success' : payment.reviewStatus === 'rebutjat' ? 'danger' : 'warning';

  if (editing) {
    return (
      <div className="animate-fade-in space-y-4">
        <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">{t('edit')}</h2>

        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t('formDate')}
              type="date"
              value={editData.paymentDate || ''}
              onChange={e => setEditData(prev => ({ ...prev, paymentDate: e.target.value }))}
            />
            <Input
              label={t('formTime')}
              type="time"
              value={editData.paymentTime || ''}
              onChange={e => setEditData(prev => ({ ...prev, paymentTime: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t('formAmount')}
              type="number"
              inputMode="decimal"
              step="0.01"
              value={String(editData.amount || '')}
              onChange={e => setEditData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
            />
            <Select
              label={t('formCurrency')}
              value={editData.currency || 'EUR'}
              onChange={e => setEditData(prev => ({ ...prev, currency: e.target.value }))}
              options={[
                { value: 'EUR', label: 'EUR (€)' },
                { value: 'USD', label: 'USD ($)' },
                { value: 'GBP', label: 'GBP (£)' },
              ]}
            />
          </div>
          <Select
            label={t('formPaymentMethod')}
            value={editData.paymentMethod || 'ingrés'}
            onChange={e => setEditData(prev => ({ ...prev, paymentMethod: e.target.value as PaymentMethod }))}
            options={[
              { value: 'efectiu', label: t('methodCash') },
              { value: 'transferència', label: t('methodTransfer') },
              { value: 'bizum', label: t('methodBizum') },
              { value: 'ingrés', label: t('methodDeposit') },
              { value: 'altre', label: t('methodOther') },
            ]}
          />
          <Select
            label={t('formStatus')}
            value={editData.reviewStatus || 'pendent'}
            onChange={e => setEditData(prev => ({ ...prev, reviewStatus: e.target.value as ReviewStatus }))}
            options={[
              { value: 'pendent', label: t('statusPending') },
              { value: 'revisat', label: t('statusReviewed') },
              { value: 'rebutjat', label: t('statusRejected') },
            ]}
          />
          <Input
            label={t('detailSender')}
            value={editData.senderName || ''}
            onChange={e => setEditData(prev => ({ ...prev, senderName: e.target.value }))}
          />
          <Input
            label={t('detailConcept')}
            value={editData.concept || ''}
            onChange={e => setEditData(prev => ({ ...prev, concept: e.target.value }))}
          />
          <Input
            label={t('detailBank')}
            value={editData.bankName || ''}
            onChange={e => setEditData(prev => ({ ...prev, bankName: e.target.value }))}
          />
          <Input
            label={t('detailIban')}
            value={editData.ibanMasked || ''}
            onChange={e => setEditData(prev => ({ ...prev, ibanMasked: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t('detailOpCode')}
              value={editData.operationCode || ''}
              onChange={e => setEditData(prev => ({ ...prev, operationCode: e.target.value }))}
            />
            <Input
              label={t('detailRef')}
              value={editData.referenceCode || ''}
              onChange={e => setEditData(prev => ({ ...prev, referenceCode: e.target.value }))}
            />
          </div>
          <TextArea
            label={t('detailNotes')}
            value={editData.notes || ''}
            onChange={e => setEditData(prev => ({ ...prev, notes: e.target.value }))}
            rows={2}
          />
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setEditing(false)}>{t('cancel')}</Button>
          <Button fullWidth onClick={saveEdit}>{t('save')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">{t('recordDetail')}</h2>
          {loan && <p className="text-sm text-surface-500">{loan.name}</p>}
        </div>
        <Badge variant={statusVariant} size="md">{translateStatus(payment.reviewStatus)}</Badge>
      </div>

      {/* Amount hero */}
      <Card className="p-5 text-center bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 border-brand-200 dark:border-brand-800">
        <p className="text-3xl font-bold text-brand-700 dark:text-brand-300">
          {formatCurrency(payment.amount, payment.currency)}
        </p>
        <p className="text-sm text-brand-600/70 dark:text-brand-400/70 mt-1">
          {formatDateTime(payment.paymentDate, payment.paymentTime)} · {translatePaymentMethod(payment.paymentMethod)}
        </p>
      </Card>

      {/* Images */}
      {attachments.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
            Imatges ({attachments.length})
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {attachments.map(att => {
              const url = imageUrls.get(att.id);
              return (
                <button
                  key={att.id}
                  onClick={() => url && setShowImageModal(url)}
                  className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 border-surface-200 dark:border-surface-600 hover:border-brand-400 transition-colors"
                >
                  {url ? (
                    <img src={url} alt={att.fileName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
                      <span className="text-xs text-surface-400">📄</span>
                    </div>
                  )}
                  <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] text-center py-0.5 uppercase font-semibold">
                    {att.pageType}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Details grid */}
      <Card className="p-4 space-y-3">
        <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">{t('details')}</p>

        <DetailRow label={t('detailSender')} value={payment.senderName} />
        <DetailRow label={t('detailConcept')} value={payment.concept} />
        <DetailRow label={t('detailBank')} value={payment.bankName} />
        <DetailRow label={t('detailIban')} value={payment.ibanMasked} mono />
        <DetailRow label={t('detailOpCode')} value={payment.operationCode} mono />
        <DetailRow label={t('detailRef')} value={payment.referenceCode} mono />
        {payment.notes && <DetailRow label={t('detailNotes')} value={payment.notes} />}

        {/* OCR info */}
        {payment.ocrRawText && (
          <div className="pt-2 border-t border-surface-100 dark:border-surface-700">
            <div className="flex items-center justify-between">
              <span className="text-xs text-surface-400">
                OCR confiança: <span className="font-bold">{payment.ocrConfidence}%</span>
              </span>
              <button
                onClick={() => setShowOcr(true)}
                className="text-xs text-brand-600 font-semibold hover:underline"
              >
                Veure OCR
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Metadata */}
      <Card className="p-4">
        <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">{t('metadata')}</p>
        <DetailRow label="Creat" value={new Date(payment.createdAt).toLocaleString('ca-ES')} />
        <DetailRow label="Actualitzat" value={new Date(payment.updatedAt).toLocaleString('ca-ES')} />
      </Card>

      {/* Actions */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" fullWidth onClick={startEdit}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={() => setShowDeleteConfirm(true)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Esborrar
          </Button>
        </div>
        {payment.reviewStatus !== 'revisat' && (
          <Button
            fullWidth
            onClick={async () => {
              await paymentService.update(payment.id, { reviewStatus: 'revisat' });
              addToast('success', t('markedReviewed'));
              loadData();
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Marcar com a revisat
          </Button>
        )}
      </div>

      {/* OCR Modal */}
      <Modal isOpen={showOcr} onClose={() => setShowOcr(false)} title={t('fullOcrText')} maxWidth="max-w-lg">
        <div className="bg-surface-50 dark:bg-surface-900 rounded-xl p-4 max-h-80 overflow-y-auto">
          <pre className="text-xs font-mono text-surface-700 dark:text-surface-300 whitespace-pre-wrap break-words">
            {payment.ocrRawText || "No s'ha detectat text."}
          </pre>
        </div>
      </Modal>

      {/* Image Modal */}
      <Modal isOpen={!!showImageModal} onClose={() => setShowImageModal(null)} maxWidth="max-w-xl">
        {showImageModal && (
          <img src={showImageModal} alt="Rebut" className="w-full rounded-xl" />
        )}
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title={t('deleteRecord')}
        message="S'eliminaran el registre i totes les seves imatges. Aquesta acció no es pot desfer."
        confirmText="Sí, esborrar"
      />
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-xs text-surface-400 flex-shrink-0">{label}</span>
      <span className={`text-sm text-surface-700 dark:text-surface-300 text-right ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}
