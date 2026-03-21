import { db } from '@/db/database';
import type { PaymentRecord, Attachment, ImageBlob } from '@/types';

export const paymentService = {
  async getByLoanId(loanId: string): Promise<PaymentRecord[]> {
    return db.paymentRecords
      .where('loanId')
      .equals(loanId)
      .reverse()
      .sortBy('paymentDate');
  },

  async getById(id: string): Promise<PaymentRecord | null> {
    return (await db.paymentRecords.get(id)) ?? null;
  },

  async create(record: Omit<PaymentRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentRecord> {
    const now = new Date().toISOString();
    const newRecord: PaymentRecord = {
      ...record,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    await db.paymentRecords.add(newRecord);
    return newRecord;
  },

  async update(id: string, data: Partial<PaymentRecord>): Promise<void> {
    await db.paymentRecords.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  async delete(id: string): Promise<void> {
    const attachments = await db.attachments.where('paymentRecordId').equals(id).toArray();
    for (const att of attachments) {
      await db.imageBlobs.delete(att.localBlobRef);
    }
    await db.attachments.where('paymentRecordId').equals(id).delete();
    await db.paymentRecords.delete(id);
  },

  async getAttachments(paymentRecordId: string): Promise<Attachment[]> {
    return db.attachments.where('paymentRecordId').equals(paymentRecordId).toArray();
  },

  async addAttachment(attachment: Omit<Attachment, 'id' | 'createdAt'>, blob: Blob): Promise<Attachment> {
    const blobId = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.imageBlobs.add({
      id: blobId,
      data: blob,
      createdAt: now,
    });

    const newAttachment: Attachment = {
      ...attachment,
      id: crypto.randomUUID(),
      localBlobRef: blobId,
      createdAt: now,
    };
    await db.attachments.add(newAttachment);
    return newAttachment;
  },

  async deleteAttachment(attachmentId: string): Promise<void> {
    const att = await db.attachments.get(attachmentId);
    if (att) {
      await db.imageBlobs.delete(att.localBlobRef);
      await db.attachments.delete(attachmentId);
    }
  },

  async getImageBlob(blobId: string): Promise<Blob | null> {
    const record = await db.imageBlobs.get(blobId);
    return record?.data ?? null;
  },

  async getLastPayment(loanId: string): Promise<PaymentRecord | null> {
    const payments = await db.paymentRecords
      .where('loanId')
      .equals(loanId)
      .toArray();
    if (payments.length === 0) return null;
    payments.sort((a, b) => b.paymentDate.localeCompare(a.paymentDate));
    return payments[0];
  },

  async search(loanId: string, query: string): Promise<PaymentRecord[]> {
    const all = await this.getByLoanId(loanId);
    const q = query.toLowerCase();
    return all.filter(
      p =>
        p.concept.toLowerCase().includes(q) ||
        p.senderName.toLowerCase().includes(q) ||
        p.bankName.toLowerCase().includes(q) ||
        p.notes.toLowerCase().includes(q) ||
        String(p.amount).includes(q)
    );
  },

  async filterByDate(loanId: string, from: string, to: string): Promise<PaymentRecord[]> {
    const all = await this.getByLoanId(loanId);
    return all.filter(p => {
      if (from && p.paymentDate < from) return false;
      if (to && p.paymentDate > to) return false;
      return true;
    });
  },
};
