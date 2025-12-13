import React, { useCallback } from 'react';
import { UploadCloud } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (content: string, fileName: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileUpload(content, file.name);
      };
      reader.readAsText(file);
    }
  }, [onFileUpload]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <label 
        htmlFor="file-upload" 
        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-800/50 hover:bg-gray-800 hover:border-blue-500 transition-all duration-300 group"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadCloud className="w-12 h-12 mb-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
          <p className="mb-2 text-sm text-gray-300">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">Terraform files (.tf)</p>
        </div>
        <input 
          id="file-upload" 
          type="file" 
          accept=".tf"
          className="hidden" 
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default FileUpload;