/**
 * TraceAI Input Validators
 */

import { MIN_TEXT_LENGTH } from './constants';
import { countCharacters, countWords } from './formatters';

export function validateTextInput(text) {
  if (!text || typeof text !== 'string') {
    return {
      isValid: false,
      error: 'Please enter or paste text to perform an analysis.'
    };
  }

  const trimmed = text.trim();
  const charCount = countCharacters(trimmed);
  const wordCount = countWords(trimmed);

  if (charCount < MIN_TEXT_LENGTH) {
    return {
      isValid: false,
      error: `Input is too short (${charCount} characters). Minimum ${MIN_TEXT_LENGTH} characters required for meaningful linguistic analysis.`
    };
  }

  if (wordCount < 10) {
    return {
      isValid: false,
      error: `Input has only ${wordCount} words. At least 10 words are recommended for pattern evaluation.`
    };
  }

  return { isValid: true, error: null };
}

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
