export interface Document {
  id: string;
  file: File;
  type: 'original' | 'sample';
}

export interface FindReplaceInstruction {
  id: string;
  find: string;
  replace: string;
}

export interface ProcessedDocument {
  fileName: string;
  url: string;
  type: 'docx' | 'pdf';
}

export interface AppState {
  originalDocument: Document | null;
  sampleDocument: Document | null;
  findReplaceInstructions: FindReplaceInstruction[];
  isProcessing: boolean;
  processedDocuments: ProcessedDocument[];
  error: string | null;
}
