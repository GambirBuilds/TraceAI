/**
 * TraceAI Video Analysis Controller
 * Supports asynchronous job dispatch for large video media files.
 */

import { validateUploadedFile } from '../validators/uploadValidator.js';
import videoDetectionService from '../services/detection/videoDetectionService.js';
import fileStorageService from '../services/storage/fileStorageService.js';
import analysisRepository from '../repositories/analysisRepository.js';
import jobProcessor from '../jobs/jobProcessor.js';
import { successResponse } from '../utils/responseFormatter.js';

export const videoController = {
  async analyze(req, res, next) {
    try {
      const file = req.file;
      validateUploadedFile(file, 'video');

      const userId = req.user?.id || null;

      // Store securely
      const stored = await fileStorageService.storeFile(file.buffer, file.originalname, file.mimetype);

      // Inspect video parameters
      const detectionResult = await videoDetectionService.analyzeVideo(file.buffer, file.originalname, file.mimetype);

      // Create background tracking job
      const job = jobProcessor.createJob({
        type: 'video-analysis',
        userId,
        payload: {
          precomputedResult: detectionResult
        }
      });

      // Persist analysis record
      const saved = await analysisRepository.create({
        userId,
        contentType: 'video',
        status: detectionResult.status,
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        inputReference: stored.storageKey,
        assessmentLabel: detectionResult.assessment.label,
        assessmentScore: detectionResult.assessment.score,
        modelConfidence: 'inconclusive',
        findings: detectionResult.findings,
        provenance: detectionResult.provenance,
        model: detectionResult.model
      });

      return successResponse(res, {
        id: saved.id,
        jobId: job.id,
        jobStatus: job.status,
        contentType: 'video',
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

export default videoController;
