import { createWorker, type Worker } from 'tesseract.js';
import { parseOcrText } from '@/utils/ocrParser';
import type { OcrResult } from '@/types';

let worker: Worker | null = null;
let workerReady = false;

async function getWorker(): Promise<Worker> {
  if (worker && workerReady) return worker;

  worker = await createWorker('spa+cat', 1, {
    // Tesseract.js v5 handles CDN automatically
  });

  workerReady = true;
  return worker;
}

export const ocrService = {
  async processImage(imageSource: File | Blob | string): Promise<OcrResult> {
    try {
      const w = await getWorker();
      const { data } = await w.recognize(imageSource);

      const rawText = data.text || '';
      const confidence = Math.round(data.confidence || 0);
      const parsedData = parseOcrText(rawText);

      return {
        rawText,
        confidence,
        parsedData,
      };
    } catch (error) {
      console.error('OCR processing error:', error);
      return {
        rawText: '',
        confidence: 0,
        parsedData: {},
      };
    }
  },

  async processMultipleImages(images: (File | Blob)[]): Promise<OcrResult> {
    const results: OcrResult[] = [];

    for (const img of images) {
      const result = await this.processImage(img);
      results.push(result);
    }

    // Merge results: combine all text, take best confidence, merge parsed data
    const mergedText = results.map(r => r.rawText).filter(Boolean).join('\n---\n');
    const bestConfidence = Math.max(...results.map(r => r.confidence), 0);

    // Merge parsed data: take first non-empty value for each field
    const mergedParsed = parseOcrText(mergedText);

    // Fill in from individual results if merged parse missed something
    for (const result of results) {
      for (const [key, value] of Object.entries(result.parsedData)) {
        if (value && !mergedParsed[key as keyof typeof mergedParsed]) {
          (mergedParsed as any)[key] = value;
        }
      }
    }

    return {
      rawText: mergedText,
      confidence: bestConfidence,
      parsedData: mergedParsed,
    };
  },

  async terminate(): Promise<void> {
    if (worker) {
      await worker.terminate();
      worker = null;
      workerReady = false;
    }
  },
};
