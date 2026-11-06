/**
 * TraceAI Admin Controller
 * High-level system administration, provider management, and audit inspection.
 */

import { memoryDb } from '../config/database.js';
import auditLogRepository from '../repositories/auditLogRepository.js';
import evaluationRepository from '../repositories/evaluationRepository.js';
import jobProcessor, { jobStore } from '../jobs/jobProcessor.js';
import config from '../config/environment.js';
import { successResponse } from '../utils/responseFormatter.js';
import { NotFoundError } from '../utils/errors.js';

export const adminController = {
  async getOverview(req, res, next) {
    try {
      const users = Array.from(memoryDb.users.values());
      const analyses = Array.from(memoryDb.analyses.values());
      const jobs = Array.from(jobStore.values());

      const activeUsers = users.length;
      const totalAnalyses = analyses.length;
      const activeJobs = jobs.filter(j => j.status === 'processing' || j.status === 'queued').length;
      const failedJobs = jobs.filter(j => j.status === 'failed').length;

      // Approximate storage usage
      const totalStorageBytes = analyses.reduce((acc, r) => acc + (r.fileSize || 0), 0);

      return successResponse(res, {
        registeredUsers: users.length,
        activeUsers,
        totalAnalyses,
        activeJobs,
        failedJobs,
        totalStorageBytes,
        systemHealth: {
          status: 'healthy',
          nodeVersion: process.version,
          uptimeSeconds: Math.round(process.uptime()),
          memoryRssBytes: process.memoryUsage().rss
        },
        providers: {
          text: { provider: config.aiProviders.text, active: Boolean(config.aiProviders.hfToken) },
          image: { provider: config.aiProviders.image, active: Boolean(config.aiProviders.hfToken) },
          audio: { provider: config.aiProviders.audio, active: Boolean(config.aiProviders.hfToken) },
          video: { provider: config.aiProviders.video, active: false }
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async listUsers(req, res, next) {
    try {
      const users = Array.from(memoryDb.users.values()).map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        subscriptionTier: u.subscriptionTier || 'pro',
        monthlyQuota: u.monthlyQuota || 250,
        quotaUsed: u.quotaUsed || 0,
        createdAt: u.createdAt
      }));
      return successResponse(res, users);
    } catch (err) {
      next(err);
    }
  },

  async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role, subscriptionTier } = req.body;
      const user = memoryDb.users.get(id);
      if (!user) throw new NotFoundError(`User ${id} not found.`);

      if (role) user.role = role;
      if (subscriptionTier) user.subscriptionTier = subscriptionTier;
      memoryDb.users.set(id, user);

      await auditLogRepository.log({
        userId: req.user?.id,
        action: 'UPDATE_USER_PERMISSIONS',
        resource: id,
        metadata: { role, subscriptionTier }
      });

      return successResponse(res, {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionTier: user.subscriptionTier
      });
    } catch (err) {
      next(err);
    }
  },

  async listLogs(req, res, next) {
    try {
      const logs = await auditLogRepository.findMany({ limit: 100 });
      return successResponse(res, logs);
    } catch (err) {
      next(err);
    }
  },

  async getEvaluationDatasets(req, res, next) {
    try {
      const datasets = await evaluationRepository.getDatasets();
      return successResponse(res, datasets);
    } catch (err) {
      next(err);
    }
  },

  async listJobs(req, res, next) {
    try {
      const jobs = Array.from(jobStore.values());
      return successResponse(res, jobs);
    } catch (err) {
      next(err);
    }
  }
};

export default adminController;
