# Document Updater Web App

A single-page web application (SPA) designed to streamline the process of updating and rebranding documents, such as handbooks, for new clients. Users can upload an original document (PDF or Word), provide content instructions (e.g., find-and-replace), and apply styling from a sample Word document.

## Features

- **Client-Side Processing**: All document processing happens in the browser for privacy and efficiency
- **File Upload**: Upload original documents (PDF or Word) and sample Word documents for styling
- **Content Updates**: Apply find-and-replace instructions to modify text content
- **Styling Application**: Apply styles from the sample Word document to the updated content
- **Output Generation**: Download the updated document as a Word file (.docx), with an option for PDF

## Technology Stack

- **Frontend Framework**: React 19+ with TypeScript
- **UI Components**: Material UI (@mui/material)
- **File Upload**: react-dropzone for drag-and-drop functionality
- **Document Processing**: Placeholder for Apryse SDK integration (requires license for production)
- **Build Tool**: Vite for fast development and optimized production builds

## Project Structure

```
document-updater-app/
├── public/              # Static assets
├── src/
│   ├── assets/          # Application assets
│   ├── components/      # React components
│   │   ├── ContentInstructions/  # Find-and-replace form
│   │   ├── DocumentProcessor/    # Document processing and download
│   │   ├── FileUpload/           # File upload components
│   │   ├── Layout/               # Application layout
│   │   └── UI/                   # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # Service layer for document processing
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── vite-env.d.ts    # Vite environment types
├── .eslintrc.json       # ESLint configuration
├── .prettierrc          # Prettier configuration
├── index.html           # HTML entry point
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
├── tsconfig.node.json   # TypeScript configuration for Node
└── vite.config.ts       # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js 16.0 or later
- npm 7.0 or later

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/document-updater-app.git
   cd document-updater-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Future Enhancements

- **Apryse SDK Integration**: Implement actual document processing with Apryse SDK
- **Advanced Editing**: Support for adding/removing sections or restructuring documents
- **Improved PDF Handling**: Enhanced layout preservation for PDF documents
- **Custom Styling Options**: Allow users to select specific styles from the sample to apply

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Material UI](https://mui.com/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [react-dropzone](https://react-dropzone.js.org/)
