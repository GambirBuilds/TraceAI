/**
 * TraceAI Unit Tests — File Signature Verification & Hashing
 */

import assert from 'node:assert';
import { test } from 'node:test';
import { verifyFileSignature, getBufferSha256 } from '../../src/utils/fileUtils.js';

test('verifyFileSignature detects JPEG magic bytes correctly', () => {
  const jpegHeader = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01]);
  const res = verifyFileSignature(jpegHeader, 'image');
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.detectedFormat, 'image/jpeg');
});

test('verifyFileSignature detects PNG magic bytes correctly', () => {
  const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D]);
  const res = verifyFileSignature(pngHeader, 'image');
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.detectedFormat, 'image/png');
});

test('verifyFileSignature rejects corrupted or spoofed buffers', () => {
  const fakeBuffer = Buffer.from('NOT_AN_IMAGE_BUFFER');
  const res = verifyFileSignature(fakeBuffer, 'image');
  assert.strictEqual(res.isValid, false);
});

test('getBufferSha256 generates consistent cryptographic hash', () => {
  const buf = Buffer.from('TraceAI Content Forensics Sample');
  const hash1 = getBufferSha256(buf);
  const hash2 = getBufferSha256(buf);
  assert.strictEqual(hash1, hash2);
  assert.strictEqual(typeof hash1, 'string');
  assert.strictEqual(hash1.length, 64);
});
