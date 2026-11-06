/**
 * TraceAI Provenance Aggregation Service
 */

import c2paService from './c2paService';

export const provenanceService = {
  inspectMediaProvenance(buffer, category) {
    const c2paResult = c2paService.inspectBuffer(buffer);

    return {
      available: c2paResult.manifestFound,
      standard: c2paResult.standard,
      issuer: c2paResult.issuer,
      validationStatus: c2paResult.validationStatus,
      generationInformation: c2paResult.generationInformation,
      sources: c2paResult.manifestFound ? [c2paResult.issuer || 'C2PA Manifest'] : []
    };
  }
};

export default provenanceService;
