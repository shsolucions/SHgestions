import Dexie, { type Table } from 'dexie';
import type { User, Loan, PaymentRecord, Attachment, ImageBlob } from '@/types';

export class AppDatabase extends Dexie {
  users!: Table<User, string>;
  loans!: Table<Loan, string>;
  paymentRecords!: Table<PaymentRecord, string>;
  attachments!: Table<Attachment, string>;
  imageBlobs!: Table<ImageBlob, string>;

  constructor() {
    super('SHgestionsDB');

    this.version(2).stores({
      users: 'id, username',
      loans: 'id, userId, status, createdAt, [userId+status]',
      paymentRecords: 'id, loanId, paymentDate, reviewStatus, [loanId+paymentDate+amount]',
      attachments: 'id, paymentRecordId',
      imageBlobs: 'id',
    });
  }
}

export const db = new AppDatabase();

export async function ensureDefaultUser(): Promise<void> {
  const count = await db.users.count();
  if (count === 0) {
    const { hashPin } = await import('@/utils/hashPin');
    const pinHash = await hashPin('1234');
    await db.users.add({
      id: crypto.randomUUID(),
      username: 'admin',
      displayName: 'Administrador',
      pinHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}
