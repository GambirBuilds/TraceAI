/**
 * TraceAI File Validation Utility
 * Enforces client-side validation for file formats and size constraints.
 */

import { SUPPORTED_FILE_TYPES, MAX_FILE_SIZES } from './constants';
import { formatBytes } from './formatters';

export function validateFile(file, category) {
  if (!file) {
    return { isValid: false, error: 'No file provided.' };
  }

  const categoryKey = category?.toUpperCase();
  const allowedMimeTypes = SUPPORTED_FILE_TYPES[categoryKey];
  const maxBytes = MAX_FILE_SIZES[categoryKey];

  if (!allowedMimeTypes || !maxBytes) {
    return { isValid: false, error: `Unsupported analysis category: ${category}` };
  }

  // Validate MIME type
  const isTypeAllowed = allowedMimeTypes.some(type => {
    if (type === file.type) return true;
    // Handle extension match if browser fails MIME detection
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (categoryKey === 'IMAGE' && ['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return true;
    if (categoryKey === 'AUDIO' && ['mp3', 'wav', 'm4a', 'aac', 'ogg'].includes(ext)) return true;
    if (categoryKey === 'VIDEO' && ['mp4', 'webm', 'mov'].includes(ext)) return true;
    return false;
  });

  if (!isTypeAllowed) {
    const readableExtensions = allowedMimeTypes
      .map(t => t.split('/')[1]?.toUpperCase())
      .join(', ');
    return {
      isValid: false,
      error: `Invalid file format (${file.type || 'unknown'}). Supported formats: ${readableExtensions}.`
    };
  }

  // Validate File Size
  if (file.size > maxBytes) {
    return {
      isValid: false,
      error: `File size (${formatBytes(file.size)}) exceeds maximum limit of ${formatBytes(maxBytes)}.`
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File appears to be empty (0 bytes).'
    };
  }

  return { isValid: true, error: null };
}
