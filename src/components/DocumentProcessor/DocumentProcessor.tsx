import { Box, Typography, CircularProgress } from '@mui/material';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { ProcessedDocument } from '@/types';

interface DocumentProcessorProps {
  isProcessing: boolean;
  processedDocuments: ProcessedDocument[];
  onProcess: () => void;
  canProcess: boolean;
}

/**
 * DocumentProcessor component for processing documents and displaying results
 */
export const DocumentProcessor = ({
  isProcessing,
  processedDocuments,
  onProcess,
  canProcess,
}: DocumentProcessorProps) => {
  return (
    <Card title="Process Document">
      <Typography variant="body2" color="text.secondary" paragraph>
        Click the button below to process your document with the specified content instructions and styling.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          onClick={onProcess}
          disabled={!canProcess || isProcessing}
          fullWidth
          size="large"
          startIcon={isProcessing ? <CircularProgress size={24} color="inherit" /> : null}
        >
          {isProcessing ? 'Processing...' : 'Process Document'}
        </Button>
      </Box>

      {processedDocuments.length > 0 && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Processed Documents
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {processedDocuments.map((doc) => (
              <Box
                key={doc.fileName}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1">{doc.fileName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {doc.type.toUpperCase()}
                  </Typography>
                </Box>
                <Button
                  href={doc.url}
                  variant="outlined"
                  size="small"
                  onClick={(e) => {
                    // Create a temporary link element to trigger download
                    const link = document.createElement('a');
                    link.href = doc.url;
                    link.download = doc.fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    e.preventDefault();
                  }}
                >
                  Download
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Card>
  );
};
