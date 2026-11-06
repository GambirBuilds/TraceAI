/**
 * TraceAI Audio Analysis Service
 * Inspects audio file metadata, duration, container parameters, and synthetic speech markers.
 */

import apiClient from '../api/apiClient';
import { API_CONFIG } from '../api/apiConfig';
import { formatBytes, formatDuration } from '../../utils/formatters';

export const audioAnalysisService = {
  /**
   * Submits audio file to the audio analysis pipeline.
   */
  async analyzeAudio(file, options = {}) {
    const formData = new FormData();
    formData.append('audio', file);
    if (options.vocoderCheck) formData.append('vocoderCheck', 'true');

    try {
      const response = await apiClient.post(API_CONFIG.endpoints.analyzeAudio, formData);
      return response;
    } catch {
      return generateAudioInspection(file);
    }
  }
};

async function generateAudioInspection(file) {
  const duration = await getAudioDuration(file);

  const findings = [
    {
      id: 'f-aud-container',
      title: 'Container & Codec Validation',
      description: `Verified container type ${file.type || 'audio/encoded'}. Size: ${formatBytes(file.size)}.`,
      severity: 'neutral'
    },
    {
      id: 'f-aud-duration',
      title: 'Temporal Stream Duration',
      description: `Playback length determined as ${formatDuration(duration)} (${duration.toFixed(1)} seconds).`,
      severity: 'neutral'
    },
    {
      id: 'f-aud-phase',
      title: 'Phase Inconsistency & Vocoder Artifacts',
      description: 'Spectral acoustic model analysis scheduled for activation in Part 2 backend service.',
      severity: 'neutral'
    }
  ];

  return {
    id: `aud-${Date.now()}`,
    contentType: 'audio',
    status: 'completed',
    createdAt: new Date().toISOString(),
    fileName: file.name,
    fileSize: file.size,
    duration,
    assessment: {
      label: 'Audio Stream Inspected',
      score: null, // No fake random percentages
      scoreMeaning: 'Audio stream parameters and container parsed. Vocoder and neural TTS detection pipelines pending Part 2 microservice.',
      limitations: [
        'Compressed lossy audio formats (e.g. 64-128kbps MP3) introduce phase artifacts indistinguishable from neural vocoders.',
        'Studio voice compression and de-essers can reduce natural pitch variability.',
        'Requires minimum 5 seconds of continuous phonemic speech for statistical stability.'
      ]
    },
    findings,
    model: {
      name: 'TraceAI Acoustic Inspector',
      version: 'v1.0-client-preview'
    },
    provenance: {
      available: false,
      sources: []
    },
    isClientEvaluation: true
  };
}

function getAudioDuration(file) {
  return new Promise((resolve) => {
    const audio = document.createElement('audio');
    const url = URL.createObjectURL(file);
    audio.preload = 'metadata';
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(audio.duration || 0);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(0);
    };
    audio.src = url;
  });
}
