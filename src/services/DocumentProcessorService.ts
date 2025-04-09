import { Document, FindReplaceInstruction, ProcessedDocument } from '@/types';
import { createDownloadLink } from '@/utils/helpers';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { Document as DocxDocument, Packer, Paragraph, TextRun } from 'docx';

/**
 * Service for processing documents
 */
export class DocumentProcessorService {
  /**
   * Process a document with find-and-replace instructions and styling from a sample document
   * @param originalDocument The document to be processed
   * @param sampleDocument The document to extract styling from
   * @param instructions Find-and-replace instructions
   * @returns Promise resolving to processed documents (DOCX and optionally PDF)
   */
  public static async processDocument(
    originalDocument: Document,
    sampleDocument: Document,
    instructions: FindReplaceInstruction[]
  ): Promise<ProcessedDocument[]> {
    try {
      console.log('Processing document:', originalDocument.file.name);
      console.log('Using sample document for styling:', sampleDocument.file.name);
      console.log('Applying instructions:', instructions);
      
      // Determine document type and process accordingly
      if (originalDocument.file.type === 'application/pdf') {
        return this.processPdfDocument(originalDocument, sampleDocument, instructions);
      } else if (originalDocument.file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return this.processWordDocument(originalDocument, sampleDocument, instructions);
      } else {
        throw new Error('Unsupported document type');
      }
    } catch (error) {
      console.error('Error processing document:', error);
      throw new Error('Failed to process document. Please try again.');
    }
  }
  
  /**
   * Process a Word document
   * @param originalDocument The Word document to be processed
   * @param sampleDocument The document to extract styling from
   * @param instructions Find-and-replace instructions
   * @returns Promise resolving to processed documents
   */
  private static async processWordDocument(
    originalDocument: Document,
    sampleDocument: Document,
    instructions: FindReplaceInstruction[]
  ): Promise<ProcessedDocument[]> {
    // For demonstration purposes, we'll create a simple Word document
    // In a real implementation, we would parse the original document and apply changes
    
    // Create a new document
    const doc = new DocxDocument({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Processed Document: ${originalDocument.file.name}`,
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Sample Document Used for Styling: ${sampleDocument.file.name}`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Applied Changes:",
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            ...instructions.map(
              (instruction) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• Changed "${instruction.find}" to "${instruction.replace}"`,
                      size: 24,
                    }),
                  ],
                })
            ),
          ],
        },
      ],
    });

    // Generate the DOCX file
    const docxBlob = await Packer.toBlob(doc);
    
    // Create a PDF version as well
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    page.drawText(`Processed Document: ${originalDocument.file.name}`, {
      x: 50,
      y: page.getHeight() - 50,
      size: 16,
      font,
    });
    
    page.drawText(`Sample Document Used for Styling: ${sampleDocument.file.name}`, {
      x: 50,
      y: page.getHeight() - 80,
      size: 12,
      font,
    });
    
    page.drawText("Applied Changes:", {
      x: 50,
      y: page.getHeight() - 120,
      size: 14,
      font,
    });
    
    let yOffset = 150;
    instructions.forEach((instruction) => {
      page.drawText(`• Changed "${instruction.find}" to "${instruction.replace}"`, {
        x: 70,
        y: page.getHeight() - yOffset,
        size: 12,
        font,
      });
      yOffset += 30;
    });
    
    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    // Return processed documents
    return [
      {
        fileName: originalDocument.file.name.replace(/\.(docx|pdf)$/i, '_updated.docx'),
        url: createDownloadLink(docxBlob),
        type: 'docx'
      },
      {
        fileName: originalDocument.file.name.replace(/\.(docx|pdf)$/i, '_updated.pdf'),
        url: createDownloadLink(pdfBlob),
        type: 'pdf'
      }
    ];
  }
  
  /**
   * Process a PDF document
   * @param originalDocument The PDF document to be processed
   * @param sampleDocument The document to extract styling from
   * @param instructions Find-and-replace instructions
   * @returns Promise resolving to processed documents
   */
  private static async processPdfDocument(
    originalDocument: Document,
    sampleDocument: Document,
    instructions: FindReplaceInstruction[]
  ): Promise<ProcessedDocument[]> {
    // For demonstration purposes, we'll create a simple PDF document
    // In a real implementation, we would parse the original PDF and apply changes
    
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    page.drawText(`Processed Document: ${originalDocument.file.name}`, {
      x: 50,
      y: page.getHeight() - 50,
      size: 16,
      font: boldFont,
    });
    
    page.drawText(`Sample Document Used for Styling: ${sampleDocument.file.name}`, {
      x: 50,
      y: page.getHeight() - 80,
      size: 12,
      font,
    });
    
    page.drawText("Applied Changes:", {
      x: 50,
      y: page.getHeight() - 120,
      size: 14,
      font: boldFont,
    });
    
    let yOffset = 150;
    instructions.forEach((instruction) => {
      page.drawText(`• Changed "${instruction.find}" to "${instruction.replace}"`, {
        x: 70,
        y: page.getHeight() - yOffset,
        size: 12,
        font,
      });
      yOffset += 30;
    });
    
    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    // Also create a Word document version
    const doc = new DocxDocument({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Processed Document: ${originalDocument.file.name}`,
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Sample Document Used for Styling: ${sampleDocument.file.name}`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Applied Changes:",
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            ...instructions.map(
              (instruction) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• Changed "${instruction.find}" to "${instruction.replace}"`,
                      size: 24,
                    }),
                  ],
                })
            ),
          ],
        },
      ],
    });

    // Generate the DOCX file
    const docxBlob = await Packer.toBlob(doc);
    
    // Return processed documents
    return [
      {
        fileName: originalDocument.file.name.replace(/\.(docx|pdf)$/i, '_updated.docx'),
        url: createDownloadLink(docxBlob),
        type: 'docx'
      },
      {
        fileName: originalDocument.file.name.replace(/\.(docx|pdf)$/i, '_updated.pdf'),
        url: createDownloadLink(pdfBlob),
        type: 'pdf'
      }
    ];
  }
}
