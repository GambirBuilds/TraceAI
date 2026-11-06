/**
 * TraceAI Upload Validation Helpers
 */

import { verifyFileSignature } from '../utils/fileUtils.js';
import { ValidationError } from '../utils/errors.js';

const MAX_SIZES = {
  image: 20 * 1024 * 1024, // 20 MB
  audio: 50 * 1024 * 1024, // 50 MB
  video: 100 * 1024 * 1024 // 100 MB
};

export function validateUploadedFile(file, category) {
  if (!file) {
    throw new ValidationError(`No ${category} file provided in upload request.`);
  }

  const maxSize = MAX_SIZES[category];
  if (maxSize && file.size > maxSize) {
    throw new ValidationError(
      `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds allowable limit of ${(maxSize / (1024 * 1024))}MB.`
    );
  }

  if (file.size === 0) {
    throw new ValidationError('Uploaded file is empty (0 bytes).');
  }

  // Magic byte signature validation
  const signatureCheck = verifyFileSignature(file.buffer, category);
  if (!signatureCheck.isValid) {
    throw new ValidationError(signatureCheck.error);
  }

  return signatureCheck;
}
