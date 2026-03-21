// ============================================
// Export Service — PDF i Excel
// ============================================

import { db } from '@/db/database';
import { formatCurrency, formatDate, translatePaymentMethod, translateStatus } from '@/utils/formatters';
import type { Loan, PaymentRecord } from '@/types';

export const exportService = {
  /**
   * Exportar historial d'un préstec a PDF
   */
  async exportLoanToPdf(loanId: string): Promise<void> {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const loan = await db.loans.get(loanId);
    if (!loan) throw new Error('Préstec no trobat');

    const payments = await db.paymentRecords
      .where('loanId')
      .equals(loanId)
      .toArray();

    payments.sort((a, b) => a.paymentDate.localeCompare(b.paymentDate));

    const totalRepaid = payments
      .filter(p => p.reviewStatus !== 'rebutjat')
      .reduce((s, p) => s + p.amount, 0);
    const pending = Math.max(0, loan.principalAmount - totalRepaid);

    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('SHgestions', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(`Exportat: ${new Date().toLocaleString('ca-ES')}`, 14, 27);

    // Loan info
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(loan.name, 14, 40);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const info = [
      `Prestador: ${loan.lenderName}`,
      `Prestatari: ${loan.borrowerName}`,
      `Import prestat: ${formatCurrency(loan.principalAmount, loan.currency)}`,
      `Total retornat: ${formatCurrency(totalRepaid, loan.currency)}`,
      `Pendent: ${formatCurrency(pending, loan.currency)}`,
      `Data inici: ${formatDate(loan.startDate)}`,
      `Estat: ${translateStatus(loan.status)}`,
    ];

    let y = 48;
    for (const line of info) {
      doc.text(line, 14, y);
      y += 6;
    }

    if (loan.notes) {
      y += 2;
      doc.text(`Notes: ${loan.notes}`, 14, y, { maxWidth: 180 });
      y += 10;
    }

    // Payments table
    y += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Historial de pagaments', 14, y);
    y += 4;

    if (payments.length > 0) {
      const tableData = payments.map(p => [
        formatDate(p.paymentDate),
        formatCurrency(p.amount, p.currency),
        translatePaymentMethod(p.paymentMethod),
        p.concept || '—',
        p.bankName || '—',
        translateStatus(p.reviewStatus),
      ]);

      autoTable(doc, {
        startY: y,
        head: [['Data', 'Import', 'Mètode', 'Concepte', 'Banc', 'Estat']],
        body: tableData,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [29, 93, 215], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          0: { cellWidth: 24 },
          1: { cellWidth: 28, halign: 'right' },
          3: { cellWidth: 45 },
        },
      });
    } else {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('No hi ha registres de pagament.', 14, y + 4);
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Pàgina ${i} de ${pageCount} — SHgestions`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    doc.save(`${loan.name.replace(/\s+/g, '_')}_historial.pdf`);
  },

  /**
   * Exportar historial d'un préstec a Excel
   */
  async exportLoanToExcel(loanId: string): Promise<void> {
    const XLSX = await import('xlsx');

    const loan = await db.loans.get(loanId);
    if (!loan) throw new Error('Préstec no trobat');

    const payments = await db.paymentRecords
      .where('loanId')
      .equals(loanId)
      .toArray();

    payments.sort((a, b) => a.paymentDate.localeCompare(b.paymentDate));

    const totalRepaid = payments
      .filter(p => p.reviewStatus !== 'rebutjat')
      .reduce((s, p) => s + p.amount, 0);

    // Sheet 1: Resum del préstec
    const summaryData = [
      ['SHgestions — Resum del préstec'],
      [],
      ['Nom', loan.name],
      ['Prestador', loan.lenderName],
      ['Prestatari', loan.borrowerName],
      ['Import prestat', loan.principalAmount],
      ['Moneda', loan.currency],
      ['Total retornat', totalRepaid],
      ['Pendent', Math.max(0, loan.principalAmount - totalRepaid)],
      ['Data inici', formatDate(loan.startDate)],
      ['Estat', translateStatus(loan.status)],
      ['Nombre moviments', payments.length],
      ['Notes', loan.notes || ''],
      [],
      ['Exportat', new Date().toLocaleString('ca-ES')],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    summarySheet['!cols'] = [{ wch: 20 }, { wch: 40 }];

    // Sheet 2: Historial de pagaments
    const paymentsHeader = [
      'Data', 'Hora', 'Import', 'Moneda', 'Mètode', 'Ordenant',
      'Concepte', 'Banc', 'IBAN', 'Codi operació', 'Referència',
      'Estat', 'Notes',
    ];

    const paymentsData = payments.map(p => [
      formatDate(p.paymentDate),
      p.paymentTime,
      p.amount,
      p.currency,
      translatePaymentMethod(p.paymentMethod),
      p.senderName,
      p.concept,
      p.bankName,
      p.ibanMasked,
      p.operationCode,
      p.referenceCode,
      translateStatus(p.reviewStatus),
      p.notes,
    ]);

    const paymentsSheet = XLSX.utils.aoa_to_sheet([paymentsHeader, ...paymentsData]);
    paymentsSheet['!cols'] = paymentsHeader.map(() => ({ wch: 16 }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Resum');
    XLSX.utils.book_append_sheet(wb, paymentsSheet, 'Pagaments');

    XLSX.writeFile(wb, `${loan.name.replace(/\s+/g, '_')}_historial.xlsx`);
  },

  /**
   * Exportar TOTS els préstecs a un únic Excel
   */
  async exportAllToExcel(): Promise<void> {
    const XLSX = await import('xlsx');

    const loans = await db.loans.toArray();
    const wb = XLSX.utils.book_new();

    // Summary sheet
    const summaryHeader = ['Nom', 'Prestador', 'Prestatari', 'Import', 'Moneda', 'Estat', 'Data inici'];
    const summaryData = loans.map(l => [
      l.name, l.lenderName, l.borrowerName,
      l.principalAmount, l.currency,
      translateStatus(l.status), formatDate(l.startDate),
    ]);
    const summarySheet = XLSX.utils.aoa_to_sheet([summaryHeader, ...summaryData]);
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Tots els préstecs');

    // One sheet per loan
    for (const loan of loans) {
      const payments = await db.paymentRecords.where('loanId').equals(loan.id).toArray();
      payments.sort((a, b) => a.paymentDate.localeCompare(b.paymentDate));

      const header = ['Data', 'Import', 'Mètode', 'Concepte', 'Banc', 'Estat'];
      const data = payments.map(p => [
        formatDate(p.paymentDate), p.amount,
        translatePaymentMethod(p.paymentMethod),
        p.concept, p.bankName, translateStatus(p.reviewStatus),
      ]);

      const sheet = XLSX.utils.aoa_to_sheet([header, ...data]);
      // Sheet name max 31 chars
      const sheetName = loan.name.substring(0, 28).replace(/[\\\/\*\?\[\]:]/g, '_');
      XLSX.utils.book_append_sheet(wb, sheet, sheetName);
    }

    XLSX.writeFile(wb, `SHgestions_complet_${new Date().toISOString().split('T')[0]}.xlsx`);
  },
};
