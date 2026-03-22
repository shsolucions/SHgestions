import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/context/ToastContext';
import { ocrService } from '@/services/ocrService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { ImageFile, PageType, OcrResult } from '@/types';
import { useTranslation } from '@/i18n';

export function NewPaymentPage() {
  const navigate = useNavigate();
  const { id: loanId } = useParams<{ id: string }>();
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [images, setImages] = useState<ImageFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const newImages: ImageFile[] = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .map((file, i) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        pageType: (i === 0 ? 'davant' : i === 1 ? 'darrere' : 'extra') as PageType,
        processing: false,
      }));

    if (newImages.length === 0) {
      addToast('warning', 'No s\'han trobat imatges vàlides');
      return;
    }

    setImages(prev => [...prev, ...newImages]);
    addToast('info', `${newImages.length} imatge${newImages.length > 1 ? 's' : ''} afegida${newImages.length > 1 ? 'es' : ''}`);
  }, [addToast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
    e.target.value = '';
  };

  const removeImage = (imgId: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === imgId);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter(i => i.id !== imgId);
    });
  };

  const changePageType = (imgId: string, pageType: PageType) => {
    setImages(prev => prev.map(i => (i.id === imgId ? { ...i, pageType } : i)));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;
    setImages(prev => {
      const copy = [...prev];
      [copy[index], copy[newIndex]] = [copy[newIndex], copy[index]];
      return copy;
    });
  };

  const processOCR = async () => {
    if (images.length === 0) {
      addToast('warning', t('addAtLeastOneImage'));
      return;
    }

    setProcessing(true);
    setOcrProgress(t('initOcr'));

    try {
      // Process all images
      const allResults: OcrResult[] = [];
      for (let i = 0; i < images.length; i++) {
        setOcrProgress(`Processant imatge ${i + 1} de ${images.length}…`);

        setImages(prev =>
          prev.map((img, idx) => (idx === i ? { ...img, processing: true } : img))
        );

        const result = await ocrService.processImage(images[i].file);
        allResults.push(result);

        setImages(prev =>
          prev.map((img, idx) => (idx === i ? { ...img, processing: false, ocrResult: result } : img))
        );
      }

      // Merge all OCR results
      const mergedResult = await ocrService.processMultipleImages(images.map(i => i.file));

      setOcrProgress('');
      addToast('success', t('ocrComplete'));

      // Navigate to review page with data
      navigate(`/loans/${loanId}/review-payment`, {
        state: {
          images: images.map(img => ({
            id: img.id,
            file: img.file,
            preview: img.preview,
            pageType: img.pageType,
            ocrResult: img.ocrResult,
          })),
          mergedOcr: mergedResult,
        },
      });
    } catch (error) {
      console.error('OCR error:', error);
      addToast('error', 'Error en processar les imatges. Pots continuar manualment.');

      // Navigate anyway with empty OCR
      navigate(`/loans/${loanId}/review-payment`, {
        state: {
          images: images.map(img => ({
            id: img.id,
            file: img.file,
            preview: img.preview,
            pageType: img.pageType,
          })),
          mergedOcr: { rawText: '', confidence: 0, parsedData: {} },
        },
      });
    } finally {
      setProcessing(false);
    }
  };

  const skipOCR = () => {
    if (images.length === 0) {
      // Allow manual entry without images too
    }
    navigate(`/loans/${loanId}/review-payment`, {
      state: {
        images: images.map(img => ({
          id: img.id,
          file: img.file,
          preview: img.preview,
          pageType: img.pageType,
        })),
        mergedOcr: { rawText: '', confidence: 0, parsedData: {} },
      },
    });
  };

  return (
    <div className="animate-fade-in space-y-4">
      <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">{t('newRecord')}</h2>
      <p className="text-sm text-surface-500 dark:text-surface-400">
        {t('takePhotos')}
      </p>

      {/* Upload buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          fullWidth
          onClick={() => cameraInputRef.current?.click()}
          disabled={processing}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Càmera
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onClick={() => fileInputRef.current?.click()}
          disabled={processing}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Galeria
        </Button>
      </div>

      {/* Hidden inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image list */}
      {images.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-surface-700 dark:text-surface-300">
            Imatges ({images.length})
          </p>

          {images.map((img, index) => (
            <Card key={img.id} className="p-3">
              <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-surface-100 dark:bg-surface-700">
                  <img
                    src={img.preview}
                    alt={`Imatge ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {img.processing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-surface-500 truncate">
                      {img.file.name}
                    </span>
                    <button
                      onClick={() => removeImage(img.id)}
                      className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                      aria-label={t('newPayDeleteImage')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Page type selector */}
                  <div className="flex gap-1.5">
                    {(['davant', 'darrere', 'extra'] as PageType[]).map(type => (
                      <button
                        key={type}
                        onClick={() => changePageType(img.id, type)}
                        className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-colors ${
                          img.pageType === type
                            ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'
                            : 'bg-surface-100 text-surface-500 dark:bg-surface-700 dark:text-surface-400'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Reorder */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveImage(index, -1)}
                      disabled={index === 0}
                      className="p-1 rounded text-surface-400 hover:text-surface-600 disabled:opacity-30 transition-colors"
                      aria-label="Moure amunt"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveImage(index, 1)}
                      disabled={index === images.length - 1}
                      className="p-1 rounded text-surface-400 hover:text-surface-600 disabled:opacity-30 transition-colors"
                      aria-label="Moure avall"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* OCR result preview */}
              {img.ocrResult && img.ocrResult.rawText && (
                <div className="mt-2 p-2 bg-surface-50 dark:bg-surface-900 rounded-lg">
                  <p className="text-[10px] text-surface-400 font-semibold uppercase mb-1">
                    OCR ({img.ocrResult.confidence}% confiança)
                  </p>
                  <p className="text-xs text-surface-600 dark:text-surface-400 line-clamp-2 font-mono">
                    {img.ocrResult.rawText.substring(0, 120)}…
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Processing indicator */}
      {processing && (
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <svg className="animate-spin h-5 w-5 text-brand-600 flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-surface-900 dark:text-surface-100">Processant OCR…</p>
              <p className="text-xs text-surface-500">{ocrProgress}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Action buttons */}
      <div className="space-y-2 pt-2">
        <Button fullWidth onClick={processOCR} loading={processing} disabled={images.length === 0}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Processar amb OCR
        </Button>
        <Button variant="secondary" fullWidth onClick={skipOCR} disabled={processing}>
          Introduir manualment
        </Button>
        <Button variant="ghost" fullWidth onClick={() => navigate(-1)} disabled={processing}>
          Cancel·lar
        </Button>
      </div>
    </div>
  );
}
