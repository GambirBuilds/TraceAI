/**
 * TraceAI Application Constants
 * Core configuration and standard taxonomies for content authenticity intelligence.
 */

export const CONTENT_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  AUDIO: 'audio',
  VIDEO: 'video'
};

export const ANALYSIS_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  INCONCLUSIVE: 'inconclusive',
  FAILED: 'failed'
};

export const CONFIDENCE_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INCONCLUSIVE: 'inconclusive'
};

export const SUPPORTED_FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/webp'],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/aac', 'audio/ogg', 'audio/mp4'],
  VIDEO: ['video/mp4', 'video/webm', 'video/quicktime']
};

export const MAX_FILE_SIZES = {
  IMAGE: 20 * 1024 * 1024, // 20 MB
  AUDIO: 50 * 1024 * 1024, // 50 MB
  VIDEO: 100 * 1024 * 1024 // 100 MB
};

export const MIN_TEXT_LENGTH = 50; // Minimum characters for basic linguistic assessment
export const RECOMMENDED_TEXT_LENGTH = 250; // Recommended for reliable pattern analysis

export const NAV_ITEMS = [
  { label: 'Overview', path: '/app', icon: 'LayoutDashboard' },
  { label: 'Text Detection', path: '/app/text', icon: 'FileText' },
  { label: 'Image Detection', path: '/app/image', icon: 'Image' },
  { label: 'Audio Detection', path: '/app/audio', icon: 'Mic' },
  { label: 'Video Detection', path: '/app/video', icon: 'Video' },
  { label: 'Analysis History', path: '/app/history', icon: 'Clock' },
  { label: 'Reports', path: '/app/reports', icon: 'FileCheck' },
  { label: 'Settings', path: '/app/settings', icon: 'Settings' }
];
