import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Document } from '@/types';
import { generateId, isValidDocumentType, formatFileSize } from '@/utils/helpers';

interface UseFileUploadProps {
  type: 'original' | 'sample';
  maxSize?: number;
}

interface UseFileUploadReturn {
  document: Document | null;
  getRootProps: any;
  getInputProps: any;
  isDragActive: boolean;
  isFileTooLarge: boolean;
  isFileTypeInvalid: boolean;
  removeFile: () => void;
}

/**
 * Custom hook for file upload functionality
 */
export const useFileUpload = ({ 
  type, 
  maxSize = 10485760 // 10MB default
}: UseFileUploadProps): UseFileUploadReturn => {
  const [document, setDocument] = useState<Document | null>(null);
  const [isFileTooLarge, setIsFileTooLarge] = useState<boolean>(false);
  const [isFileTypeInvalid, setIsFileTypeInvalid] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsFileTooLarge(false);
    setIsFileTypeInvalid(false);

    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];

    // Check file size
    if (file.size > maxSize) {
      setIsFileTooLarge(true);
      return;
    }

    // Check file type
    if (!isValidDocumentType(file)) {
      setIsFileTypeInvalid(true);
      return;
    }

    // Create document object
    const newDocument: Document = {
      id: generateId(),
      file,
      type
    };

    setDocument(newDocument);
  }, [maxSize, type]);

  const removeFile = useCallback(() => {
    setDocument(null);
    setIsFileTooLarge(false);
    setIsFileTypeInvalid(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false
  });

  return {
    document,
    getRootProps,
    getInputProps,
    isDragActive,
    isFileTooLarge,
    isFileTypeInvalid,
    removeFile
  };
};
