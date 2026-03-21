import { db } from '@/db/database';
import type { Loan, LoanStatus } from '@/types';

export const loanService = {
  async getAllForUser(userId: string): Promise<Loan[]> {
    return db.loans.where('userId').equals(userId).reverse().sortBy('createdAt');
  },

  async getById(id: string): Promise<Loan | null> {
    return (await db.loans.get(id)) ?? null;
  },

  async create(loan: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>): Promise<Loan> {
    const now = new Date().toISOString();
    const newLoan: Loan = {
      ...loan,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    await db.loans.add(newLoan);
    return newLoan;
  },

  async update(id: string, data: Partial<Loan>): Promise<void> {
    await db.loans.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  async delete(id: string): Promise<void> {
    const payments = await db.paymentRecords.where('loanId').equals(id).toArray();
    for (const payment of payments) {
      const attachments = await db.attachments.where('paymentRecordId').equals(payment.id).toArray();
      for (const att of attachments) {
        await db.imageBlobs.delete(att.localBlobRef);
      }
      await db.attachments.where('paymentRecordId').equals(payment.id).delete();
    }
    await db.paymentRecords.where('loanId').equals(id).delete();
    await db.loans.delete(id);
  },

  async getTotalRepaid(loanId: string): Promise<number> {
    const payments = await db.paymentRecords.where('loanId').equals(loanId).toArray();
    return payments
      .filter(p => p.reviewStatus !== 'rebutjat')
      .reduce((sum, p) => sum + p.amount, 0);
  },

  async getPaymentCount(loanId: string): Promise<number> {
    return db.paymentRecords.where('loanId').equals(loanId).count();
  },

  async searchForUser(userId: string, query: string): Promise<Loan[]> {
    const all = await this.getAllForUser(userId);
    const q = query.toLowerCase();
    return all.filter(
      l =>
        l.name.toLowerCase().includes(q) ||
        l.lenderName.toLowerCase().includes(q) ||
        l.borrowerName.toLowerCase().includes(q) ||
        l.notes.toLowerCase().includes(q)
    );
  },
};
