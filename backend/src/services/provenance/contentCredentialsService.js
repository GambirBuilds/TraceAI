/**
 * TraceAI Content Credentials & Watermark Service
 */

import c2paService from './c2paService';

export const contentCredentialsService = {
  validate(buffer, mimeType) {
    return c2paService.inspectBuffer(buffer);
  }
};

export default contentCredentialsService;
