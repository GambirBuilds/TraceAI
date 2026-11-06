/**
 * TraceAI Analysis Records & System Controller
 */

import analysisRepository from '../repositories/analysisRepository.js';
import fileStorageService from '../services/storage/fileStorageService.js';
import jobProcessor from '../jobs/jobProcessor.js';
import config from '../config/environment.js';
import { successResponse } from '../utils/responseFormatter.js';
import { NotFoundError } from '../utils/errors.js';

export const analysisController = {
  async listAnalyses(req, res, next) {
    try {
      const { contentType, status, limit, offset } = req.query;
      const records = await analysisRepository.findMany({
        contentType,
        status,
        limit: limit ? parseInt(limit, 10) : 50,
        offset: offset ? parseInt(offset, 10) : 0
      });

      return successResponse(res, records, 200, {
        count: records.length,
        limit: limit || 50,
        offset: offset || 0
      });
    } catch (err) {
      next(err);
    }
  },

  async getAnalysisById(req, res, next) {
    try {
      const { id } = req.params;
      const record = await analysisRepository.findById(id);
      if (!record) {
        throw new NotFoundError(`Analysis record ${id} not found.`);
      }
      return successResponse(res, record);
    } catch (err) {
      next(err);
    }
  },

  async getAnalysisBreakdown(req, res, next) {
    try {
      const { id } = req.params;
      const record = await analysisRepository.findById(id);
      if (!record) {
        throw new NotFoundError(`Analysis record ${id} not found.`);
      }

      if (record.contentType !== 'text') {
        return successResponse(res, {
          analysisId: record.id,
          available: false,
          message: `Sentence-level writing breakdown is only applicable to text analyses. Current contentType is '${record.contentType}'.`
        }, 200);
      }

      if (record.breakdown) {
        return successResponse(res, {
          analysisId: record.id,
          contentType: record.contentType,
          createdAt: record.createdAt,
          ...record.breakdown
        }, 200);
      }

      return successResponse(res, {
        analysisId: record.id,
        available: false,
        message: 'No sentence-level breakdown recorded for this analysis.'
      }, 200);
    } catch (err) {
      next(err);
    }
  },

  async deleteAnalysis(req, res, next) {
    try {
      const { id } = req.params;
      const record = await analysisRepository.findById(id);
      if (!record) {
        throw new NotFoundError(`Analysis record ${id} not found.`);
      }

      // If there is an associated storage file, clean it up
      if (record.inputReference) {
        await fileStorageService.deleteFile(record.inputReference);
      }

      await analysisRepository.delete(id);
      return successResponse(res, { message: `Analysis record ${id} successfully deleted.` });
    } catch (err) {
      next(err);
    }
  },

  async getJobStatus(req, res, next) {
    try {
      const { jobId } = req.params;
      const job = jobProcessor.getJob(jobId);
      if (!job) {
        throw new NotFoundError(`Job ${jobId} not found.`);
      }
      return successResponse(res, job);
    } catch (err) {
      next(err);
    }
  },

  async cancelJob(req, res, next) {
    try {
      const { jobId } = req.params;
      const success = jobProcessor.deleteJob(jobId);
      if (!success) {
        throw new NotFoundError(`Job ${jobId} not found.`);
      }
      return successResponse(res, { message: `Job ${jobId} canceled.` });
    } catch (err) {
      next(err);
    }
  },

  async getProvidersStatus(req, res) {
    return successResponse(res, {
      textProvider: {
        name: config.aiProviders.text,
        configured: Boolean(config.aiProviders.hfToken || config.aiProviders.openaiApiKey),
        model: 'roberta-base-openai-detector'
      },
      imageProvider: {
        name: config.aiProviders.image,
        configured: Boolean(config.aiProviders.hfToken),
        model: 'umm-maybe/AI-image-detector'
      },
      audioProvider: {
        name: config.aiProviders.audio,
        configured: Boolean(config.aiProviders.hfToken),
        model: 'synthetic-speech-auditor'
      },
      videoProvider: {
        name: config.aiProviders.video,
        configured: false,
        model: 'temporal-optical-flow-pending'
      },
      provenance: {
        c2paEnabled: true,
        exifEnabled: true
      }
    });
  },

  async health(req, res) {
    return successResponse(res, {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'traceai-backend-api',
      version: '2.0.0',
      uptime: process.uptime()
    });
  }
};

export default analysisController;
