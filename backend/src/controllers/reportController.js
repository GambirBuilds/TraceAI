/**
 * TraceAI Reports Controller
 */

import reportGenerationService from '../services/reports/reportGenerationService.js';
import reportRepository from '../repositories/reportRepository.js';
import analysisRepository from '../repositories/analysisRepository.js';
import { successResponse } from '../utils/responseFormatter.js';
import { NotFoundError } from '../utils/errors.js';

export const reportController = {
  async listReports(req, res, next) {
    try {
      const reports = await reportRepository.findMany();
      return successResponse(res, reports);
    } catch (err) {
      next(err);
    }
  },

  async getReportById(req, res, next) {
    try {
      const { id } = req.params;
      // id can be a report ID or an analysis ID
      let report = await reportRepository.findById(id);
      if (!report) {
        // Try generating on the fly from analysis
        report = await reportGenerationService.generateReport(id, req.user?.id || null);
      }
      return successResponse(res, report);
    } catch (err) {
      next(err);
    }
  },

  async downloadReport(req, res, next) {
    try {
      const { id } = req.params;
      const report = await reportGenerationService.generateReport(id, req.user?.id || null);

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="traceai-audit-${id}.json"`);
      return res.status(200).send(JSON.stringify(report.content || report, null, 2));
    } catch (err) {
      next(err);
    }
  }
};

export default reportController;
