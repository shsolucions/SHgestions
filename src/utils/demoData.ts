import { db } from '@/db/database';
import type { Loan, PaymentRecord } from '@/types';

export async function seedDemoData(): Promise<void> {
  const existingLoans = await db.loans.count();
  if (existingLoans > 0) return;

  // Get the default admin user
  const adminUser = await db.users.where('username').equals('admin').first();
  if (!adminUser) return;

  const loanId1 = crypto.randomUUID();
  const loanId2 = crypto.randomUUID();

  const loans: Loan[] = [
    {
      id: loanId1,
      userId: adminUser.id,
      name: 'PRÉSTEC BYD',
      lenderName: 'Joan Garcia',
      borrowerName: 'Said Hammouda',
      principalAmount: 10000,
      currency: 'EUR',
      startDate: '2024-06-15',
      notes: 'Préstec per a la compra del vehicle BYD. Devolució en terminis mensuals.',
      status: 'actiu',
      createdAt: '2024-06-15T10:00:00.000Z',
      updatedAt: '2024-06-15T10:00:00.000Z',
    },
    {
      id: loanId2,
      userId: adminUser.id,
      name: 'PRÉSTEC REFORMA CUINA',
      lenderName: 'Maria López',
      borrowerName: 'Said Hammouda',
      principalAmount: 3500,
      currency: 'EUR',
      startDate: '2025-01-10',
      notes: 'Reforma de la cuina. Retorn previst en 6 mesos.',
      status: 'actiu',
      createdAt: '2025-01-10T10:00:00.000Z',
      updatedAt: '2025-01-10T10:00:00.000Z',
    },
  ];

  const payments: PaymentRecord[] = [
    {
      id: crypto.randomUUID(),
      loanId: loanId1,
      paymentDate: '2024-07-20',
      paymentTime: '10:15',
      amount: 600,
      currency: 'EUR',
      paymentMethod: 'ingrés',
      senderName: 'Said Hammouda',
      concept: 'Devolució mensual juliol',
      bankName: 'Santander',
      ibanMasked: 'ES12 **** **** 4567',
      operationCode: 'OP-2024-001',
      referenceCode: 'REF-78901',
      ocrRawText: 'SANTANDER\nFECHA: 20/07/2024\nHORA: 10:15\nINGRESO EN EFECTIVO\nIMPORTE: 600,00 EUR\nORDENANTE: SAID HAMMOUDA',
      ocrConfidence: 87,
      reviewStatus: 'revisat',
      notes: '',
      createdAt: '2024-07-20T10:20:00.000Z',
      updatedAt: '2024-07-20T10:20:00.000Z',
    },
    {
      id: crypto.randomUUID(),
      loanId: loanId1,
      paymentDate: '2024-08-18',
      paymentTime: '12:31',
      amount: 600,
      currency: 'EUR',
      paymentMethod: 'ingrés',
      senderName: 'Said Hammouda',
      concept: 'Devolució mensual agost',
      bankName: 'Santander',
      ibanMasked: 'ES12 **** **** 4567',
      operationCode: 'OP-2024-002',
      referenceCode: 'REF-78902',
      ocrRawText: 'SANTANDER\nFECHA: 18/08/2024\nHORA: 12:31\nINGRESO EN EFECTIVO\nIMPORTE: 600,00 EUR\nORDENANTE: SAID HAMMOUDA',
      ocrConfidence: 92,
      reviewStatus: 'revisat',
      notes: '',
      createdAt: '2024-08-18T12:35:00.000Z',
      updatedAt: '2024-08-18T12:35:00.000Z',
    },
    {
      id: crypto.randomUUID(),
      loanId: loanId1,
      paymentDate: '2024-09-20',
      paymentTime: '09:45',
      amount: 800,
      currency: 'EUR',
      paymentMethod: 'transferència',
      senderName: 'Said Hammouda',
      concept: 'Devolució setembre + extra',
      bankName: 'CaixaBank',
      ibanMasked: 'ES34 **** **** 7890',
      operationCode: 'OP-2024-003',
      referenceCode: 'REF-78903',
      ocrRawText: 'CAIXABANK\nFECHA: 20/09/2024\nTRANSFERENCIA\nIMPORTE: 800,00 EUR',
      ocrConfidence: 78,
      reviewStatus: 'revisat',
      notes: 'Ha afegit 200€ extres aquest mes.',
      createdAt: '2024-09-20T09:50:00.000Z',
      updatedAt: '2024-09-20T09:50:00.000Z',
    },
    {
      id: crypto.randomUUID(),
      loanId: loanId2,
      paymentDate: '2025-02-15',
      paymentTime: '14:00',
      amount: 500,
      currency: 'EUR',
      paymentMethod: 'bizum',
      senderName: 'Said Hammouda',
      concept: 'Primera devolució reforma',
      bankName: '',
      ibanMasked: '',
      operationCode: '',
      referenceCode: 'BZ-2025-001',
      ocrRawText: 'BIZUM ENVIAT\nIMPORT: 500,00€\nDATA: 15/02/2025',
      ocrConfidence: 65,
      reviewStatus: 'pendent',
      notes: 'Pagat per Bizum',
      createdAt: '2025-02-15T14:05:00.000Z',
      updatedAt: '2025-02-15T14:05:00.000Z',
    },
  ];

  await db.loans.bulkAdd(loans);
  await db.paymentRecords.bulkAdd(payments);
}
