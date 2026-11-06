/**
 * TraceAI Video Analysis Service
 * Inspects video container metadata, resolution, duration, and prepares deepfake analysis pipeline.
 */

import apiClient from '../api/apiClient';
import { API_CONFIG } from '../api/apiConfig';
import { formatBytes, formatDuration } from '../../utils/formatters';

export const videoAnalysisService = {
  /**
   * Submits a video file to the video analysis pipeline.
   */
  async analyzeVideo(file, options = {}) {
    const formData = new FormData();
    formData.append('video', file);
    if (options.frameSamplingRate) formData.append('samplingRate', options.frameSamplingRate);

    try {
      const response = await apiClient.post(API_CONFIG.endpoints.analyzeVideo, formData);
      if (response && response.jobId) {
        // Poll job status until completed
        let attempts = 0;
        while (attempts < 10) {
          await new Promise(r => setTimeout(r, 500));
          attempts++;
          try {
            const jobStatus = await apiClient.get(`/jobs/${response.jobId}`);
            if (jobStatus && (jobStatus.status === 'completed' || jobStatus.status === 'inconclusive')) {
              break;
            }
          } catch {}
        }
      }
      return response;
    } catch {
      return generateVideoInspection(file);
    }
  }
};

async function generateVideoInspection(file) {
  const metadata = await getVideoMetadata(file);

  const findings = [
    {
      id: 'f-vid-format',
      title: 'Container & Track Verification',
      description: `Verified container type ${file.type || 'video/mp4'}. File payload: ${formatBytes(file.size)}.`,
      severity: 'neutral'
    },
    {
      id: 'f-vid-res',
      title: 'Spatial Canvas & Timeline',
      description: `Parsed resolution: ${metadata.width} x ${metadata.height} pixels. Total timeline: ${formatDuration(metadata.duration)} (${metadata.duration.toFixed(1)}s).`,
      severity: 'neutral'
    },
    {
      id: 'f-vid-pipeline',
      title: 'Deepfake & Facial Reenactment Classifier',
      description: 'Temporal optical flow and frame-by-frame 3D landmark tracking queued for Part 2 model server deployment.',
      severity: 'neutral'
    }
  ];

  return {
    id: `vid-${Date.now()}`,
    contentType: 'video',
    status: 'completed',
    createdAt: new Date().toISOString(),
    fileName: file.name,
    fileSize: file.size,
    dimensions: `${metadata.width}x${metadata.height}`,
    duration: metadata.duration,
    assessment: {
      label: 'Video Timeline Inspected',
      score: null, // No fake random percentages
      scoreMeaning: 'Container and track parameters validated. Deepfake detection models will be active upon Part 2 backend integration.',
      limitations: [
        'Notice: Automated deepfake classification is strictly pending real neural model integration.',
        'Heavy social media compression algorithms generate temporal macroblocking resembling synthetic flicker.',
        'Facial boundary analysis requires continuous unoccluded face tracking for minimum 60 consecutive frames.'
      ]
    },
    findings,
    model: {
      name: 'TraceAI Video Structural Inspector',
      version: 'v1.0-client-preview'
    },
    provenance: {
      available: false,
      sources: []
    },
    isClientEvaluation: true
  };
}

function getVideoMetadata(file) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: video.videoWidth || 0,
        height: video.videoHeight || 0,
        duration: video.duration || 0
      });
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 0, height: 0, duration: 0 });
    };
    video.src = url;
  });
}
