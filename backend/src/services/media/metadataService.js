/**
 * TraceAI Media Metadata Inspection Service
 * Extracts EXIF headers, PNG metadata chunks, audio ID3/WAVE parameters, and MP4 atoms from binary buffers.
 */

import logger from '../../utils/logger.js';

export const metadataService = {
  /**
   * Extracts real image metadata (EXIF / PNG text chunks).
   */
  extractImageMetadata(buffer, mimeType) {
    const meta = {
      format: mimeType,
      byteLength: buffer.length,
      hasExif: false,
      cameraMake: null,
      cameraModel: null,
      software: null,
      dateTime: null,
      colorSpace: 'sRGB',
      resolution: null,
      missingMetadata: []
    };

    try {
      const bufferStr = buffer.toString('binary');

      // 1. JPEG EXIF Scanning
      if (mimeType === 'image/jpeg' || buffer.slice(0, 3).toString('hex') === 'ffd8ff') {
        const exifIndex = bufferStr.indexOf('Exif\0\0');
        if (exifIndex !== -1) {
          meta.hasExif = true;
          // Look for recognizable ascii tags near the EXIF header
          const exifSlice = buffer.slice(exifIndex, Math.min(buffer.length, exifIndex + 2048)).toString('utf-8', 'ignore');

          // Common camera manufacturers
          const cameraBrands = ['Apple', 'Canon', 'Nikon', 'Sony', 'Fujifilm', 'Leica', 'Samsung', 'Google'];
          for (const brand of cameraBrands) {
            if (exifSlice.includes(brand)) {
              meta.cameraMake = brand;
              break;
            }
          }

          if (exifSlice.includes('iPhone')) meta.cameraModel = 'Apple iPhone';
          else if (exifSlice.includes('Pixel')) meta.cameraModel = 'Google Pixel';

          // Check for editing software tags
          if (exifSlice.includes('Photoshop')) meta.software = 'Adobe Photoshop';
          else if (exifSlice.includes('Lightroom')) meta.software = 'Adobe Lightroom';
          else if (exifSlice.includes('Midjourney')) meta.software = 'Midjourney AI Generator';
          else if (exifSlice.includes('Stable Diffusion')) meta.software = 'Stable Diffusion WebUI';
          else if (exifSlice.includes('DALL·E')) meta.software = 'OpenAI DALL-E';
        } else {
          meta.missingMetadata.push('EXIF camera headers absent (typical of web-optimized or stripped images).');
        }
      }

      // 2. PNG Chunk Scanning
      if (mimeType === 'image/png') {
        if (bufferStr.includes('tEXt') || bufferStr.includes('iTXt')) {
          meta.hasExif = true;
          if (bufferStr.includes('Software')) {
            const swIdx = bufferStr.indexOf('Software');
            meta.software = bufferStr.substring(swIdx + 8, swIdx + 48).replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
          }
          if (bufferStr.includes('parameters') || bufferStr.includes('Prompt')) {
            meta.software = 'Diffusion Generation Pipeline (Embedded Text Chunk)';
          }
        } else {
          meta.missingMetadata.push('No standard PNG tEXt or iTXt metadata chunks embedded.');
        }
      }
    } catch (err) {
      logger.warn('Error reading image metadata', { error: err.message });
    }

    return meta;
  },

  /**
   * Extracts real audio metadata (ID3 / RIFF chunk parameters).
   */
  extractAudioMetadata(buffer, mimeType) {
    const meta = {
      format: mimeType,
      byteLength: buffer.length,
      sampleRate: 44100, // standard default
      channels: 2,
      durationEstimatedSeconds: 0,
      encoder: null,
      hasId3: false
    };

    try {
      // Check ID3 header
      if (buffer.slice(0, 3).toString('ascii') === 'ID3') {
        meta.hasId3 = true;
        const headerStr = buffer.slice(0, 1024).toString('ascii', 'ignore');
        if (headerStr.includes('LAME')) meta.encoder = 'LAME MP3 Encoder';
        else if (headerStr.includes('Lavf')) meta.encoder = 'FFmpeg / Libavformat';
      }

      // Check RIFF / WAVE
      if (buffer.slice(0, 4).toString('ascii') === 'RIFF') {
        const sampleRateOffset = 24;
        if (buffer.length > 32) {
          meta.sampleRate = buffer.readUInt32LE(sampleRateOffset);
          meta.channels = buffer.readUInt16LE(22);
          const byteRate = buffer.readUInt32LE(28);
          if (byteRate > 0) {
            meta.durationEstimatedSeconds = Math.round((buffer.length - 44) / byteRate);
          }
        }
      } else {
        // Approximate duration based on standard 128kbps for MP3
        meta.durationEstimatedSeconds = Math.round(buffer.length / (16000));
      }
    } catch (err) {
      logger.warn('Error reading audio metadata', { error: err.message });
    }

    return meta;
  },

  /**
   * Extracts real video container metadata (MP4 / WebM atom tags).
   */
  extractVideoMetadata(buffer, mimeType) {
    const meta = {
      format: mimeType,
      byteLength: buffer.length,
      containerBrand: 'mp42',
      hasAudioTrack: true,
      hasVideoTrack: true,
      durationEstimatedSeconds: Math.round(buffer.length / (250000)) // rough estimate based on 2Mbps
    };

    try {
      const bufferStr = buffer.slice(0, 2048).toString('ascii', 'ignore');
      if (bufferStr.includes('ftyp')) {
        const brandIdx = bufferStr.indexOf('ftyp');
        meta.containerBrand = bufferStr.substring(brandIdx + 4, brandIdx + 8).trim();
      }
    } catch (err) {
      logger.warn('Error reading video metadata', { error: err.message });
    }

    return meta;
  }
};

export default metadataService;
