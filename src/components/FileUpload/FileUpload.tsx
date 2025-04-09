import { useCallback, useState } from 'react';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import { useDropzone } from 'react-dropzone';
import { Document } from '@/types';
import { formatFileSize, isValidDocumentType, isPdfDocument, isWordDocument } from '@/utils/helpers';
import { Card } from '@/components/UI/Card';

interface FileUploadProps {
  type: 'original' | 'sample';
  document: Document | null;
  onDocumentChange: (document: Document | null) => void;
  maxSize?: number;
  title: string;
  description: string;
  acceptedFileTypes?: string[];
}

/**
 * FileUpload component for uploading original and sample documents
 */
export const FileUpload = ({
  type,
  document,
  onDocumentChange,
  maxSize = 10485760, // 10MB default
  title,
  description,
  acceptedFileTypes = ['.pdf', '.docx'],
}: FileUploadProps) => {
  const [isFileTooLarge, setIsFileTooLarge] = useState<boolean>(false);
  const [isFileTypeInvalid, setIsFileTypeInvalid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
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

      setIsLoading(true);

      try {
        // In a real implementation, we might want to do some preprocessing here
        // For now, we'll just create the document object
        const newDocument: Document = {
          id: crypto.randomUUID(),
          file,
          type,
        };

        onDocumentChange(newDocument);
      } catch (error) {
        console.error('Error processing file:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [maxSize, onDocumentChange, type]
  );

  const removeFile = useCallback(() => {
    onDocumentChange(null);
  }, [onDocumentChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  return (
    <Card title={title}>
      <Typography variant="body2" color="text.secondary" paragraph>
        {description}
      </Typography>

      {!document ? (
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'divider',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
        >
          <input {...getInputProps()} />
          {isLoading ? (
            <CircularProgress size={40} />
          ) : (
            <>
              <DescriptionIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body1" gutterBottom>
                {isDragActive
                  ? 'Drop the file here...'
                  : `Drag & drop a ${acceptedFileTypes.join(' or ')} file here, or click to select`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Maximum file size: {formatFileSize(maxSize)}
              </Typography>
            </>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            backgroundColor: 'background.paper',
          }}
        >
          <DescriptionIcon
            sx={{
              fontSize: 40,
              color: isPdfDocument(document.file)
                ? 'error.main'
                : isWordDocument(document.file)
                ? 'primary.main'
                : 'text.secondary',
              mr: 2,
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body1" noWrap>
              {document.file.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatFileSize(document.file.size)}
            </Typography>
          </Box>
          <IconButton onClick={removeFile} aria-label="remove file">
            <DeleteIcon />
          </IconButton>
        </Box>
      )}

      {isFileTooLarge && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          File is too large. Maximum size is {formatFileSize(maxSize)}.
        </Typography>
      )}

      {isFileTypeInvalid && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          Invalid file type. Please upload a PDF or Word document.
        </Typography>
      )}
    </Card>
  );
};
