/**
 * TraceAI useFileUpload Hook
 * Handles drag-and-drop, file validation, object URL management, and memory cleanup.
 */

import { useState, useCallback, useEffect } from 'react';
import { validateFile } from '../utils/fileValidation';

export function useFileUpload(category) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Clean up object URLs on unmount or file change
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const selectFile = useCallback((newFile) => {
    if (!newFile) return;

    setError(null);
    const validation = validateFile(newFile, category);

    if (!validation.isValid) {
      setError(validation.error);
      return false;
    }

    // Revoke previous URL if any
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(newFile);
    setFile(newFile);
    setPreviewUrl(objectUrl);
    return true;
  }, [category, previewUrl]);

  const removeFile = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setError(null);
  }, [previewUrl]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer?.files;
    if (droppedFiles && droppedFiles.length > 0) {
      selectFile(droppedFiles[0]);
    }
  }, [selectFile]);

  return {
    file,
    previewUrl,
    error,
    setError,
    isDragging,
    selectFile,
    removeFile,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
}
