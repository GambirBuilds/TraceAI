/**
 * TraceAI Text Analysis Controller
 */

import textDetectionService from '../services/detection/textDetectionService.js';
import analysisRepository from '../repositories/analysisRepository.js';
import { successResponse } from '../utils/responseFormatter.js';

export const textController = {
  async analyze(req, res, next) {
    try {
      const { text, language, options } = req.body;
      const userId = req.user?.id || null;

      // Run real text analysis pipeline
      const detectionResult = await textDetectionService.analyzeText(text, { language, ...options });

      // Persist in repository
      const saved = await analysisRepository.create({
        userId,
        contentType: 'text',
        status: detectionResult.status,
        originalFilename: 'input_text_payload.txt',
        mimeType: 'text/plain',
        fileSize: Buffer.byteLength(text, 'utf-8'),
        assessmentLabel: detectionResult.assessment.label,
        assessmentScore: detectionResult.assessment.score,
        modelConfidence: detectionResult.assessment.score !== null ? 'medium' : 'inconclusive',
        findings: detectionResult.findings,
        provenance: detectionResult.provenance,
        model: detectionResult.model,
        assessment: detectionResult.assessment,
        breakdown: detectionResult.breakdown,
        sentences: detectionResult.sentences,
        paragraphs: detectionResult.paragraphs,
        stylometrics: detectionResult.stylometrics,
        language: detectionResult.language
      });

      return successResponse(res, {
        id: saved.id,
        contentType: 'text',
        status: saved.status,
        createdAt: saved.createdAt,
        assessment: detectionResult.assessment,
        breakdown: detectionResult.breakdown,
        sentences: detectionResult.sentences,
        paragraphs: detectionResult.paragraphs,
        stylometrics: detectionResult.stylometrics,
        language: detectionResult.language,
        findings: detectionResult.findings,
        provenance: detectionResult.provenance,
        model: detectionResult.model
      }, 200);
    } catch (err) {
      next(err);
    }
  }
};

export default textController;
