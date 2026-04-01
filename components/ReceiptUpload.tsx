'use client';

import { useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';

export default function ReceiptUpload({ onUpload }: { onUpload?: (file: File) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFileName(file.name);
      onUpload?.(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      onUpload?.(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer group ${
        isDragging 
          ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]' 
          : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-indigo-50/30'
      }`}
    >
      <div className={`p-4 rounded-full shadow-sm mb-5 transition-colors duration-300 ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 text-indigo-500 group-hover:bg-indigo-50'}`}>
        <UploadCloud className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">Upload your receipt</h3>
      <p className="text-sm text-slate-500 text-center max-w-sm mb-8 leading-relaxed">
        Drag and drop your expense receipt here, or click to browse. We support high-resolution images and PDFs.
      </p>
      
      <label className="relative cursor-pointer">
        <input 
          type="file" 
          className="hidden" 
          accept="image/jpeg, image/png, application/pdf"
          onChange={handleChange}
        />
        <span className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-lg hover:bg-indigo-700 transition-all shadow-indigo-600/20 active:scale-95 flex items-center gap-2">
          <FileText className="w-4 h-4" /> 
          {selectedFileName ? 'Change File' : 'Select File'}
        </span>
      </label>
      
      {selectedFileName && (
        <div className="mt-4 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200">
          Selected: {selectedFileName}
        </div>
      )}

      <div className="mt-8 flex items-center gap-4 text-xs font-semibold text-slate-400 tracking-wider">
        <span>JPG</span>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
        <span>PNG</span>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
        <span>PDF</span>
      </div>
    </div>
  );
}
