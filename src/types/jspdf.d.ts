declare module 'jspdf' {
  export default class jsPDF {
    constructor(options?: any);
    setFontSize(size: number): void;
    setFont(fontName: string, fontStyle: string): void;
    text(text: string, x: number, y: number): void;
    addPage(): void;
    save(filename: string): void;
    setDrawColor(r: number, g: number, b: number): void;
    line(x1: number, y1: number, x2: number, y2: number): void;
  }
}

declare module 'jspdf-autotable' {
  // This module extends jsPDF with table functionality
  // The actual types are handled by the jsPDF library
} 