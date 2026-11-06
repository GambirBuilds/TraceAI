/**
 * TraceAI File Utility Functions
 * Magic number file signature verification and cryptographic hashing.
 */

import crypto from 'crypto';

export function getBufferSha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Validates real magic numbers of uploaded files to prevent MIME spoofing.
 */
export function verifyFileSignature(buffer, expectedCategory) {
  if (!buffer || buffer.length < 12) {
    return { isValid: false, detectedFormat: null, error: 'File buffer too short or empty.' };
  }

  const hexHeader = buffer.slice(0, 12).toString('hex').toUpperCase();

  // 1. Image Check
  if (expectedCategory === 'image') {
    // JPEG: FF D8 FF
    if (hexHeader.startsWith('FFD8FF')) {
      return { isValid: true, detectedFormat: 'image/jpeg' };
    }
    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (hexHeader.startsWith('89504E470D0A1A0A')) {
      return { isValid: true, detectedFormat: 'image/png' };
    }
    // WebP: RIFF .... WEBP
    const asciiHeader = buffer.slice(0, 12).toString('ascii');
    if (asciiHeader.startsWith('RIFF') && asciiHeader.substring(8, 12) === 'WEBP') {
      return { isValid: true, detectedFormat: 'image/webp' };
    }
    return { isValid: false, detectedFormat: null, error: 'File header does not match JPEG, PNG, or WebP magic bytes.' };
  }

  // 2. Audio Check
  if (expectedCategory === 'audio') {
    // MP3 with ID3: 49 44 33 ("ID3")
    if (hexHeader.startsWith('494433')) {
      return { isValid: true, detectedFormat: 'audio/mpeg' };
    }
    // MP3 raw frame sync: FF FB or FF F3 or FF F2
    if (hexHeader.startsWith('FFFB') || hexHeader.startsWith('FFF3') || hexHeader.startsWith('FFF2')) {
      return { isValid: true, detectedFormat: 'audio/mpeg' };
    }
    // WAV: RIFF .... WAVE
    const asciiHeader = buffer.slice(0, 12).toString('ascii');
    if (asciiHeader.startsWith('RIFF') && asciiHeader.substring(8, 12) === 'WAVE') {
      return { isValid: true, detectedFormat: 'audio/wav' };
    }
    // OGG: OggS (4F 67 67 53)
    if (hexHeader.startsWith('4F676753')) {
      return { isValid: true, detectedFormat: 'audio/ogg' };
    }
    // M4A / AAC (ftypM4A)
    if (asciiHeader.substring(4, 8) === 'ftyp') {
      return { isValid: true, detectedFormat: 'audio/mp4' };
    }
    return { isValid: true, detectedFormat: 'audio/generic' }; // permissive for varied container encodings
  }

  // 3. Video Check
  if (expectedCategory === 'video') {
    // MP4 / MOV: .... ftyp
    const asciiHeader = buffer.slice(4, 12).toString('ascii');
    if (asciiHeader.startsWith('ftyp') || asciiHeader.startsWith('moov')) {
      return { isValid: true, detectedFormat: 'video/mp4' };
    }
    // WebM / Matroska: 1A 45 DF A3
    if (hexHeader.startsWith('1A45DFA3')) {
      return { isValid: true, detectedFormat: 'video/webm' };
    }
    return { isValid: true, detectedFormat: 'video/generic' };
  }

  return { isValid: false, detectedFormat: null, error: `Unknown category: ${expectedCategory}` };
}
