/**
 * TraceAI Reports Page
 * Formal audit report management, executive summary inspection, and export downloads.
 */

import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Download,
  Printer,
  Eye,
  FileText,
  Image,
  Mic,
  Video,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { EmptyState } from '../../../components/common/EmptyState';
import { reportService } from '../../../services/reports/reportService';
import { formatDate } from '../../../utils/formatters';
import { useNotification } from '../../../context/NotificationContext';

export function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const { notify } = useNotification();

  useEffect(() => {
    async function fetchReports() {
      const list = await reportService.getAvailableReports();
      setReports(list);
    }
    fetchReports();
  }, []);

  const handleDownload = (record) => {
    reportService.downloadJsonReport(record);
    notify({
      title: 'Report Exported',
      message: `Audit JSON for REP-${record.id.toUpperCase()} generated.`,
      type: 'info'
    });
  };

  const handlePrint = (record) => {
    reportService.printReport(record);
  };

  const getCategoryIcon = (type) => {
    switch (type) {
      case 'text':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'image':
        return <Image className="w-4 h-4 text-indigo-600" />;
      case 'audio':
        return <Mic className="w-4 h-4 text-teal-600" />;
      case 'video':
        return <Video className="w-4 h-4 text-orange-600" />;
      default:
        return <FileCheck className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <PageContainer
      title="Audit Reports"
      description="Formal intelligence dossiers and export-ready compliance documentation for completed analyses."
    >
      {reports.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No Audit Reports Generated"
          description="Complete an analysis in Text, Image, Audio, or Video workspaces to generate verifiable audit reports."
        />
      ) : (
        <div className="space-y-6">
          <Card bodyClassName="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Report Identifier</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Analysis Type</th>
                    <th className="py-3 px-4">Evaluation Label</th>
                    <th className="py-3 px-4">Date Generated</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                        REP-{record.id.toUpperCase()}
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-900 truncate max-w-[200px]">
                        {record.title || record.fileName || record.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 capitalize text-slate-700">
                          {getCategoryIcon(record.contentType)}
                          <span>{record.contentType}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-800 font-medium">
                          {record.assessment?.label || 'Completed'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 tabular-nums font-mono text-slate-500">
                        {formatDate(record.createdAt)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Eye}
                            onClick={() => setSelectedReport(record)}
                            title="View Formal Report"
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Download}
                            onClick={() => handleDownload(record)}
                            title="Download JSON Audit"
                          >
                            JSON
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Printer}
                            onClick={() => handlePrint(record)}
                            title="Print Audit Report"
                          >
                            Print
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Formal Report Inspection Modal */}
      {selectedReport && (
        <Modal
          isOpen={Boolean(selectedReport)}
          onClose={() => setSelectedReport(null)}
          title={`Formal Audit Dossier — REP-${selectedReport.id.toUpperCase()}`}
          subtitle={`Platform: TraceAI Forensic Intelligence · Engine: ${selectedReport.model?.name || 'TraceAI'} (${selectedReport.model?.version || 'v1.4'})`}
          maxWidth="max-w-3xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] text-slate-500">
                Cryptographic manifest status: {selectedReport.provenance?.available ? 'Verified' : 'Unsigned'}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Download}
                  onClick={() => handleDownload(selectedReport)}
                >
                  Export JSON
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Printer}
                  onClick={() => handlePrint(selectedReport)}
                >
                  Print Report
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Header Meta */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <div className="text-slate-400 uppercase text-[10px] font-semibold">Content Category</div>
                <div className="font-semibold text-slate-900 uppercase mt-0.5">{selectedReport.contentType}</div>
              </div>
              <div>
                <div className="text-slate-400 uppercase text-[10px] font-semibold">Evaluation Status</div>
                <div className="font-semibold text-slate-900 capitalize mt-0.5">{selectedReport.status}</div>
              </div>
              <div>
                <div className="text-slate-400 uppercase text-[10px] font-semibold">Timestamp</div>
                <div className="font-mono tabular-nums text-slate-900 mt-0.5">{formatDate(selectedReport.createdAt)}</div>
              </div>
              <div>
                <div className="text-slate-400 uppercase text-[10px] font-semibold">Provenance</div>
                <div className="font-semibold text-slate-900 mt-0.5">
                  {selectedReport.provenance?.available ? 'C2PA Verified' : 'Unsigned'}
                </div>
              </div>
            </div>

            {/* Assessment Summary */}
            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h4 className="font-semibold text-slate-900 text-sm mb-1">
                Executive Finding: {selectedReport.assessment?.label}
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {selectedReport.assessment?.scoreMeaning || 'Analysis completed with documented structural observations.'}
              </p>
            </div>

            {/* Observations List */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 text-xs">
                Documented Observations & Computational Findings
              </h4>
              <div className="space-y-2">
                {(selectedReport.findings || []).map((f, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="font-semibold text-slate-900">{f.title}</div>
                    <div className="text-slate-600 mt-0.5 leading-relaxed">{f.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Limitations Notice */}
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-amber-900">
              <div className="font-semibold flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Forensic Boundaries & Limitations</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-amber-800">
                {(selectedReport.assessment?.limitations || []).map((lim, idx) => (
                  <li key={idx}>{lim}</li>
                ))}
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
}

export default ReportsPage;
