/**
 * TraceAI Analysis Result Presentation
 * Displays assessment findings, technical metadata, limitations, and report actions.
 */

import React from 'react';
import { Download, Printer, CheckCircle, FileText } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { FindingsList } from './FindingsList';
import { AnalysisDisclaimer } from './AnalysisDisclaimer';
import { formatDate } from '../../utils/formatters';
import { reportService } from '../../services/reports/reportService';
import { useNotification } from '../../context/NotificationContext';

export function AnalysisResult({
  result,
  onReset,
  className = ''
}) {
  const { notify } = useNotification();

  if (!result) return null;

  const handleDownload = () => {
    reportService.downloadJsonReport(result);
    notify({
      title: 'Report Downloaded',
      message: `Audit JSON exported for record ${result.id}.`,
      type: 'info'
    });
  };

  const handlePrint = () => {
    reportService.printReport(result);
  };

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700 capitalize">{result.contentType} Analysis</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{result.id}</span>
            <span aria-hidden="true">·</span>
            <span>{formatDate(result.createdAt)}</span>
          </div>
          <div className="text-base font-bold text-slate-900 mt-1">
            {result.assessment?.label || 'Analysis Completed'}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" icon={Download} onClick={handleDownload}>
            Export JSON
          </Button>
          <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint}>
            Print Audit
          </Button>
          {onReset && (
            <Button variant="secondary" size="sm" onClick={onReset}>
              New Analysis
            </Button>
          )}
        </div>
      </div>

      {/* Confidence and Calibration Metrics */}
      <ConfidenceIndicator
        assessment={result.assessment}
        provenance={result.provenance}
        model={result.model}
      />

      {/* Structured Findings */}
      <Card
        title="Forensic Observations & Stylometric Features"
        subtitle="Detailed analysis of structural patterns, syntactic variance, or media container properties"
      >
        <FindingsList findings={result.findings} />
      </Card>

      {/* Disclaimer and Limitations */}
      <AnalysisDisclaimer limitations={result.assessment?.limitations} />
    </div>
  );
}

export default AnalysisResult;
