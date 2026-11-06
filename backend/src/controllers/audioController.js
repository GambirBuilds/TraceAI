/**
 * TraceAI Audio Analysis Controller
 */

import { validateUploadedFile } from '../validators/uploadValidator.js';
import audioDetectionService from '../services/detection/audioDetectionService.js';
import fileStorageService from '../services/storage/fileStorageService.js';
import analysisRepository from '../repositories/analysisRepository.js';
import { successResponse } from '../utils/responseFormatter.js';

export const audioController = {
  async analyze(req, res, next) {
    try {
      const file = req.file;
      validateUploadedFile(file, 'audio');

      const userId = req.user?.id || null;

      // Store securely
      const stored = await fileStorageService.storeFile(file.buffer, file.originalname, file.mimetype);

      // Run audio speech authenticity pipeline
      const detectionResult = await audioDetectionService.analyzeAudio(file.buffer, file.originalname, file.mimetype);

      // Persist in repository
      const saved = await analysisRepository.create({
        userId,
        contentType: 'audio',
        status: detectionResult.status,
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        inputReference: stored.storageKey,
        assessmentLabel: detectionResult.assessment.label,
        assessmentScore: detectionResult.assessment.score,
        modelConfidence: detectionResult.assessment.score !== null ? 'medium' : 'inconclusive',
        findings: detectionResult.findings,
        provenance: detectionResult.provenance,
        model: detectionResult.model
      });

      return successResponse(res, {
        id: saved.id,
        contentType: 'audio',
        status: saved.status,
        createdAt: saved.createdAt,
        fileName: file.originalname,
        fileSize: file.size,
        assessment: detectionResult.assessment,
        findings: detectionResult.findings,
        provenance: detectionResult.provenance,
        model: detectionResult.model,
        metadata: detectionResult.metadata
      }, 200);
    } catch (err) {
      next(err);
    }
  }
};

export default audioController;
