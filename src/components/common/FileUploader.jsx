/**
 * TraceAI File Uploader Component
 * Reusable drag-and-drop dropzone with format validation indicators and accessible input.
 */

import React, { useRef } from 'react';
import { UploadCloud, File, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { formatBytes } from '../../utils/formatters';
import { MAX_FILE_SIZES } from '../../utils/constants';

export function FileUploader({
  category = 'image', // 'image' | 'audio' | 'video'
  acceptedExtensions = '.jpg,.jpeg,.png,.webp',
  onFileSelected,
  isDragging = false,
  onDragOver,
  onDragLeave,
  onDrop,
  error = null,
  className = ''
}) {
  const fileInputRef = useRef(null);
  const maxBytes = MAX_FILE_SIZES[category?.toUpperCase()] || (20 * 1024 * 1024);

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
  };

  const openBrowseDialog = () => {
    fileInputRef.current?.click();
  };

  const getFormatLabel = () => {
    if (category === 'image') return 'JPEG, PNG, WebP';
    if (category === 'audio') return 'MP3, WAV, M4A, AAC, OGG';
    if (category === 'video') return 'MP4, WebM, QuickTime MOV';
    return acceptedExtensions;
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={openBrowseDialog}
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-150 ${
          isDragging
            ? 'border-blue-500 bg-blue-50/50'
            : 'border-slate-300 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedExtensions}
          onChange={handleInputChange}
          className="hidden"
          aria-label={`Upload ${category} file`}
        />

        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-blue-600 mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold text-slate-800">
            Click to upload or drag & drop {category} file
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Supported: {getFormatLabel()} · Max {formatBytes(maxBytes)}
          </p>
        </div>

        <div className="mt-4 pointer-events-none">
          <Button variant="outline" size="sm" icon={File}>
            Browse Files
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
