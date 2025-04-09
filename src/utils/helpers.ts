import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique ID for documents and instructions
 */
export const generateId = (): string => {
  return uuidv4();
};

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if file is a valid document type (PDF or DOCX)
 */
export const isValidDocumentType = (file: File): boolean => {
  const validTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  return validTypes.includes(file.type);
};

/**
 * Get file extension from File object
 */
export const getFileExtension = (file: File): string => {
  return file.name.split('.').pop()?.toLowerCase() || '';
};

/**
 * Check if file is a Word document
 */
export const isWordDocument = (file: File): boolean => {
  return file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
};

/**
 * Check if file is a PDF document
 */
export const isPdfDocument = (file: File): boolean => {
  return file.type === 'application/pdf';
};

/**
 * Create a download URL for a processed document
 */
export const createDownloadLink = (blob: Blob): string => {
  const url = URL.createObjectURL(blob);
  return url;
};

/**
 * Revoke a download URL to free up memory
 */
export const revokeDownloadLink = (url: string): void => {
  URL.revokeObjectURL(url);
};
