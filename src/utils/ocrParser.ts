import type { OcrParsedData, PaymentMethod } from '@/types';
import { parseEuropeanAmount } from './formatters';

/**
 * Parse raw OCR text from a bank receipt and extract structured data.
 * Designed to be flexible with various Spanish/Catalan bank receipt formats.
 */
export function parseOcrText(rawText: string): OcrParsedData {
  const text = rawText.toUpperCase();
  const result: OcrParsedData = {};

  // === DATE ===
  // Patterns: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
  const datePatterns = [
    /FECHA\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/,
    /DATA\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/,
    /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/,
  ];
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      result.date = normalizeDate(match[1]);
      break;
    }
  }

  // === TIME ===
  const timePatterns = [
    /HORA\s*:?\s*(\d{1,2}:\d{2}(?::\d{2})?)/,
    /(\d{1,2}:\d{2}:\d{2})/,
    /(\d{1,2}:\d{2})\s*H/,
  ];
  for (const pattern of timePatterns) {
    const match = text.match(pattern);
    if (match) {
      result.time = match[1].substring(0, 5); // HH:MM
      break;
    }
  }

  // === AMOUNT ===
  const amountPatterns = [
    /IMPORTE\s*:?\s*([\d.,]+)\s*(?:EUR|€)?/,
    /IMPORT\s*:?\s*([\d.,]+)\s*(?:EUR|€)?/,
    /CANTIDAD\s*:?\s*([\d.,]+)\s*(?:EUR|€)?/,
    /QUANTITAT\s*:?\s*([\d.,]+)\s*(?:EUR|€)?/,
    /TOTAL\s*:?\s*([\d.,]+)\s*(?:EUR|€)?/,
    /([\d]+[.,]\d{2})\s*(?:EUR|€)/,
  ];
  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match) {
      const parsed = parseEuropeanAmount(match[1]);
      if (parsed !== null && parsed > 0) {
        result.amount = parsed;
        break;
      }
    }
  }

  // === CURRENCY ===
  if (text.includes('EUR') || text.includes('€')) {
    result.currency = 'EUR';
  } else if (text.includes('USD') || text.includes('$')) {
    result.currency = 'USD';
  } else {
    result.currency = 'EUR'; // Default
  }

  // === BANK NAME ===
  const banks = [
    'SANTANDER', 'BBVA', 'CAIXABANK', 'LA CAIXA', 'BANKINTER',
    'SABADELL', 'BANKIA', 'ING', 'OPENBANK', 'TRIODOS',
    'KUTXABANK', 'IBERCAJA', 'UNICAJA', 'ABANCA', 'CAJAMAR',
    'EVO BANCO', 'LIBERBANK', 'MEDIOLANUM', 'BANCA MARCH',
    'DEUTSCHE BANK', 'WIZINK', 'REVOLUT', 'N26',
  ];
  for (const bank of banks) {
    if (text.includes(bank)) {
      result.bankName = bank;
      break;
    }
  }

  // === CONCEPT ===
  const conceptPatterns = [
    /CONCEPTO\s*:?\s*(.+?)(?:\n|$)/,
    /CONCEPTE\s*:?\s*(.+?)(?:\n|$)/,
    /DESCRIPCI[OÓ]N?\s*:?\s*(.+?)(?:\n|$)/,
    /OBSERVACI[OÓ]N?E?S?\s*:?\s*(.+?)(?:\n|$)/,
  ];
  for (const pattern of conceptPatterns) {
    const match = text.match(pattern);
    if (match) {
      result.concept = match[1].trim();
      break;
    }
  }

  // === SENDER NAME ===
  const senderPatterns = [
    /ORDENANTE\s*:?\s*(.+?)(?:\n|$)/,
    /ORDENANT\s*:?\s*(.+?)(?:\n|$)/,
    /EMISOR\s*:?\s*(.+?)(?:\n|$)/,
    /REMITENTE\s*:?\s*(.+?)(?:\n|$)/,
    /TITULAR\s*:?\s*(.+?)(?:\n|$)/,
    /NOMBRE\s*:?\s*(.+?)(?:\n|$)/,
  ];
  for (const pattern of senderPatterns) {
    const match = text.match(pattern);
    if (match) {
      result.senderName = match[1].trim();
      break;
    }
  }

  // === REFERENCE CODE ===
  const refPatterns = [
    /REFERENCIA\s*:?\s*(\S+)/,
    /REFER[EÈ]NCIA\s*:?\s*(\S+)/,
    /N[UÚ]M(?:ERO)?\s*REF\w*\s*:?\s*(\S+)/,
    /REF\.\s*:?\s*(\S+)/,
  ];
  for (const pattern of refPatterns) {
    const match = text.match(pattern);
    if (match) {
      result.referenceCode = match[1].trim();
      break;
    }
  }

  // === OPERATION CODE ===
  const opPatterns = [
    /OPERACI[OÓ]N?\s*:?\s*(\S+)/,
    /N[UÚ]M(?:ERO)?\s*OPERACI[OÓ]N?\s*:?\s*(\S+)/,
    /C[OÓ]DIGO?\s*OPERACI[OÓ]N?\s*:?\s*(\S+)/,
  ];
  for (const pattern of opPatterns) {
    const match = text.match(pattern);
    if (match) {
      result.operationCode = match[1].trim();
      break;
    }
  }

  // === IBAN (masked) ===
  const ibanPatterns = [
    /IBAN\s*:?\s*([A-Z]{2}\d{2}[\s*\dX]{4,})/,
    /(ES\d{2}[\s*\dX]{4,})/,
    /CUENTA\s*:?\s*([\d*X\s]{10,})/,
    /COMPTE\s*:?\s*([\d*X\s]{10,})/,
  ];
  for (const pattern of ibanPatterns) {
    const match = text.match(pattern);
    if (match) {
      result.ibanMasked = match[1].trim().substring(0, 24);
      break;
    }
  }

  // === PAYMENT METHOD ===
  result.paymentMethod = detectPaymentMethod(text);

  return result;
}

function detectPaymentMethod(text: string): PaymentMethod {
  if (text.includes('BIZUM')) return 'bizum';
  if (text.includes('TRANSFERENCIA') || text.includes('TRANSFER')) return 'transferència';
  if (text.includes('EFECTIVO') || text.includes('EFECTIU') || text.includes('INGRESO EN EFECTIVO')) return 'efectiu';
  if (text.includes('INGRESO') || text.includes('INGRÉS') || text.includes('INGRES')) return 'ingrés';
  return 'altre';
}

function normalizeDate(dateStr: string): string {
  // Convert DD/MM/YYYY to YYYY-MM-DD
  const parts = dateStr.split(/[\/\-\.]/);
  if (parts.length !== 3) return dateStr;

  let [day, month, year] = parts;
  if (year.length === 2) {
    year = '20' + year;
  }

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}
