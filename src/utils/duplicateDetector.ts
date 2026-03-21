import { db } from '@/db/database';
import type { PaymentRecord } from '@/types';

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  matchingRecords: PaymentRecord[];
  reason: string;
}

/**
 * Check if a payment record might be a duplicate based on date + amount + loanId
 */
export async function checkForDuplicates(
  loanId: string,
  paymentDate: string,
  amount: number,
  excludeId?: string
): Promise<DuplicateCheckResult> {
  try {
    const existing = await db.paymentRecords
      .where('[loanId+paymentDate+amount]')
      .equals([loanId, paymentDate, amount])
      .toArray();

    const filtered = excludeId
      ? existing.filter(r => r.id !== excludeId)
      : existing;

    if (filtered.length > 0) {
      return {
        isDuplicate: true,
        matchingRecords: filtered,
        reason: `S'ha trobat ${filtered.length} registre(s) amb la mateixa data i import en aquest préstec.`,
      };
    }

    return {
      isDuplicate: false,
      matchingRecords: [],
      reason: '',
    };
  } catch {
    return {
      isDuplicate: false,
      matchingRecords: [],
      reason: '',
    };
  }
}
