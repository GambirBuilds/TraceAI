/**
 * TraceAI Report Management Service
 * Generates audit reports and provides export capabilities for completed analyses.
 */

import apiClient from '../api/apiClient';
import { API_CONFIG } from '../api/apiConfig';
import { historyService } from '../history/historyService';
import { formatDate, formatBytes } from '../../utils/formatters';

export const reportService = {
  /**
   * Retrieves all completed analysis records eligible for formal report generation.
   */
  async getAvailableReports() {
    try {
      const records = await historyService.getAll();
      return records.filter(r => r.status === 'completed' || r.status === 'inconclusive');
    } catch {
      const records = historyService.getLocalRecords();
      return records.filter(r => r.status === 'completed' || r.status === 'inconclusive');
    }
  },

  /**
   * Builds an export-ready audit object for a specific analysis record.
   */
  generateReportData(record) {
    if (!record) return null;

    return {
      reportId: `REP-${record.id.toUpperCase()}`,
      generatedAt: new Date().toISOString(),
      platform: 'TraceAI — AI Content Intelligence',
      engineVersion: record.model?.version || 'v1.4',
      record,
      summary: {
        contentType: record.contentType,
        evaluationStatus: record.status,
        findingsCount: record.findings?.length || 0,
        assessmentLabel: record.assessment?.label || record.assessmentLabel || 'Inconclusive',
        isCryptographicallySigned: Boolean(record.provenance?.available)
      },
      disclaimer: 'TraceAI forensic intelligence evaluates structural and computational markers. Computational indicators do not constitute legal proof of authorship or intent.'
    };
  },

  /**
   * Downloads the audit report as a structured JSON file.
   */
  async downloadJsonReport(record) {
    if (!record) return;

    // Trigger backend download endpoint if possible, or fallback to client generator
    try {
      const downloadUrl = `${API_CONFIG.baseUrl}/reports/${encodeURIComponent(record.id)}/download`;
      const response = await fetch(downloadUrl);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `traceai-audit-${record.id}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        return;
      }
    } catch {
      // Fallback to client-side json generation
    }

    const reportData = this.generateReportData(record);
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(reportData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `traceai-audit-${record.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  /**
   * Generates a printable audit document window.
   */
  printReport(record) {
    const reportData = this.generateReportData(record);
    if (!reportData) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const assessmentLabel = record.assessment?.label || record.assessmentLabel || 'Inconclusive';
    const limitations = record.assessment?.limitations || [];

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>TraceAI Audit Report — ${record.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #172033; }
            h1 { font-size: 24px; margin-bottom: 4px; color: #0f172a; }
            .header-bar { border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px; }
            .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px; }
            .meta-item { font-size: 13px; }
            .meta-label { color: #64748b; font-weight: 500; }
            .meta-val { font-weight: 600; color: #0f172a; }
            .section { margin-bottom: 24px; }
            .section-title { font-size: 15px; font-weight: 700; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; margin-bottom: 12px; }
            .finding-card { border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-bottom: 8px; }
            .finding-title { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
            .finding-desc { font-size: 13px; color: #475569; }
            .disclaimer { font-size: 12px; color: #64748b; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; }
          </style>
        </head>
        <body>
          <div class="header-bar">
            <h1>TraceAI Content Authenticity Audit</h1>
            <p style="color: #64748b; margin: 0; font-size: 14px;">Report ID: REP-${record.id.toUpperCase()} · Generated ${formatDate(new Date().toISOString())}</p>
          </div>
          <div class="meta-grid">
            <div class="meta-item"><span class="meta-label">Content Category:</span> <span class="meta-val">${record.contentType.toUpperCase()}</span></div>
            <div class="meta-item"><span class="meta-label">Assessment Label:</span> <span class="meta-val">${assessmentLabel}</span></div>
            <div class="meta-item"><span class="meta-label">Engine Version:</span> <span class="meta-val">${record.model?.name || 'TraceAI Forensics'} (${record.model?.version || 'v1.4'})</span></div>
            <div class="meta-item"><span class="meta-label">Provenance Status:</span> <span class="meta-val">${record.provenance?.available ? 'Cryptographically Verified' : 'Unsigned / No Manifest'}</span></div>
          </div>
          <div class="section">
            <div class="section-title">Key Observations & Findings</div>
            ${(record.findings || []).map(f => `
              <div class="finding-card">
                <div class="finding-title">${f.title}</div>
                <div class="finding-desc">${f.description}</div>
              </div>
            `).join('')}
          </div>
          <div class="section">
            <div class="section-title">Forensic Limitations & Boundary Statement</div>
            <ul style="font-size: 13px; color: #475569; padding-left: 20px;">
              ${limitations.map(lim => `<li>${lim}</li>`).join('')}
            </ul>
          </div>
          <div class="disclaimer">
            <strong>Responsible AI Notice:</strong> Computational markers reflect statistical distribution characteristics rather than conclusive human or synthetic attribution.
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  }
};

export default reportService;
