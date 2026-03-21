// ============================================
// SHgestions — Model de Dades (v3 multi-usuari)
// ============================================

export type LoanStatus = 'actiu' | 'finalitzat' | 'pausat';
export type ReviewStatus = 'pendent' | 'revisat' | 'rebutjat';
export type PageType = 'davant' | 'darrere' | 'extra';
export type PaymentMethod = 'efectiu' | 'transferència' | 'bizum' | 'ingrés' | 'altre';

export interface User {
  id: string;
  username: string;
  displayName: string;
  pinHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface Loan {
  id: string;
  userId: string; // ← NOU: cada préstec pertany a un usuari
  name: string;
  lenderName: string;
  borrowerName: string;
  principalAmount: number;
  currency: string;
  startDate: string;
  notes: string;
  status: LoanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  loanId: string;
  paymentDate: string;
  paymentTime: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  senderName: string;
  concept: string;
  bankName: string;
  ibanMasked: string;
  operationCode: string;
  referenceCode: string;
  ocrRawText: string;
  ocrConfidence: number;
  reviewStatus: ReviewStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  paymentRecordId: string;
  fileName: string;
  mimeType: string;
  localBlobRef: string;
  pageType: PageType;
  createdAt: string;
}

export interface ImageBlob {
  id: string;
  data: Blob;
  createdAt: string;
}

export interface OcrResult {
  rawText: string;
  confidence: number;
  parsedData: OcrParsedData;
}

export interface OcrParsedData {
  date?: string;
  time?: string;
  amount?: number;
  currency?: string;
  bankName?: string;
  concept?: string;
  senderName?: string;
  referenceCode?: string;
  operationCode?: string;
  ibanMasked?: string;
  paymentMethod?: PaymentMethod;
}

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  pageType: PageType;
  ocrResult?: OcrResult;
  processing: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface SyncProvider {
  name: string;
  isConnected: () => Promise<boolean>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  pushData: (data: SyncPayload) => Promise<void>;
  pullData: () => Promise<SyncPayload | null>;
  getLastSyncTime: () => Promise<string | null>;
}

export interface SyncPayload {
  users: User[];
  loans: Loan[];
  paymentRecords: PaymentRecord[];
  attachments: Attachment[];
  imageBlobs: { id: string; data: string }[];
  syncedAt: string;
}
