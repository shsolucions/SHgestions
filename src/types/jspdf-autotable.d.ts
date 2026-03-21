declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';
  
  interface AutoTableOptions {
    startY?: number;
    head?: any[][];
    body?: any[][];
    styles?: any;
    headStyles?: any;
    alternateRowStyles?: any;
    columnStyles?: Record<number, any>;
    [key: string]: any;
  }

  function autoTable(doc: jsPDF, options: AutoTableOptions): void;
  export default autoTable;
}
