import { useState, useEffect } from 'react';
import { Box, Grid as MuiGrid, Alert } from '@mui/material';
import { Layout } from '@/components/Layout/Layout';
import { FileUpload } from '@/components/FileUpload/FileUpload';
import { ContentInstructions } from '@/components/ContentInstructions/ContentInstructions';
import { DocumentProcessor } from '@/components/DocumentProcessor/DocumentProcessor';
import { Notification } from '@/components/UI/Notification';
import { Document, FindReplaceInstruction, ProcessedDocument } from '@/types';
import { generateId } from '@/utils/helpers';
import { DocumentProcessorService } from '@/services/DocumentProcessorService';

// Create a Grid Item component
const GridItem = (props: any) => {
  return <MuiGrid item {...props} />;
};

/**
 * Main App component that integrates all the pieces together
 */
function App() {
  // State for documents
  const [originalDocument, setOriginalDocument] = useState<Document | null>(null);
  const [sampleDocument, setSampleDocument] = useState<Document | null>(null);
  
  // State for find-and-replace instructions
  const [instructions, setInstructions] = useState<FindReplaceInstruction[]>([
    { id: generateId(), find: '', replace: '' }
  ]);
  
  // State for processing
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedDocuments, setProcessedDocuments] = useState<ProcessedDocument[]>([]);
  
  // State for notifications
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Check if we can process documents
  const canProcess = Boolean(originalDocument && sampleDocument && instructions.some(i => i.find && i.replace));
  
  // Add a new instruction
  const handleAddInstruction = () => {
    setInstructions(prev => [
      ...prev,
      { id: generateId(), find: '', replace: '' }
    ]);
  };
  
  // Update an instruction
  const handleUpdateInstruction = (id: string, field: 'find' | 'replace', value: string) => {
    setInstructions(prev => 
      prev.map(instruction => 
        instruction.id === id 
          ? { ...instruction, [field]: value } 
          : instruction
      )
    );
  };
  
  // Remove an instruction
  const handleRemoveInstruction = (id: string) => {
    setInstructions(prev => {
      // Don't remove if it's the last instruction
      if (prev.length <= 1) {
        return prev;
      }
      return prev.filter(instruction => instruction.id !== id);
    });
  };
  
  // Process documents
  const handleProcess = async () => {
    if (!originalDocument || !sampleDocument) {
      setNotification({
        open: true,
        message: 'Please upload both original and sample documents.',
        severity: 'error'
      });
      return;
    }
    
    // Filter out empty instructions
    const validInstructions = instructions.filter(i => i.find && i.replace);
    
    if (validInstructions.length === 0) {
      setNotification({
        open: true,
        message: 'Please add at least one valid find-and-replace instruction.',
        severity: 'error'
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Process documents
      const result = await DocumentProcessorService.processDocument(
        originalDocument,
        sampleDocument,
        validInstructions
      );
      
      setProcessedDocuments(result);
      
      setNotification({
        open: true,
        message: 'Documents processed successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error processing documents:', error);
      
      setNotification({
        open: true,
        message: error instanceof Error ? error.message : 'An unknown error occurred.',
        severity: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Close notification
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      // Revoke any object URLs to prevent memory leaks
      processedDocuments.forEach(doc => {
        if (doc.url.startsWith('blob:')) {
          URL.revokeObjectURL(doc.url);
        }
      });
    };
  }, [processedDocuments]);
  
  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          This application processes documents entirely in your browser. Your files are never uploaded to a server.
        </Alert>
        
        <MuiGrid container spacing={3}>
          {/* File Upload Section */}
          <GridItem xs={12} md={6}>
            <FileUpload
              type="original"
              document={originalDocument}
              onDocumentChange={setOriginalDocument}
              title="Original Document"
              description="Upload the document you want to update (PDF or Word)."
            />
          </GridItem>
          
          <GridItem xs={12} md={6}>
            <FileUpload
              type="sample"
              document={sampleDocument}
              onDocumentChange={setSampleDocument}
              title="Sample Document"
              description="Upload a Word document (.docx) with the styling you want to apply."
              acceptedFileTypes={['.docx']}
            />
          </GridItem>
          
          {/* Content Instructions Section */}
          <GridItem xs={12}>
            <ContentInstructions
              instructions={instructions}
              onAddInstruction={handleAddInstruction}
              onUpdateInstruction={handleUpdateInstruction}
              onRemoveInstruction={handleRemoveInstruction}
            />
          </GridItem>
          
          {/* Document Processor Section */}
          <GridItem xs={12}>
            <DocumentProcessor
              isProcessing={isProcessing}
              processedDocuments={processedDocuments}
              onProcess={handleProcess}
              canProcess={canProcess}
            />
          </GridItem>
        </MuiGrid>
      </Box>
      
      {/* Notification */}
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
      />
    </Layout>
  );
}

export default App;
