/**
 * TraceAI Analysis History & Search Archive
 * Advanced full-text search, category & status filtering, bulk selection & deletion,
 * CSV export, inspection modal, and audit dossier reviews.
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Eye,
  FileText,
  Image,
  Mic,
  Video,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowUpDown,
  Download,
  RotateCcw,
  CheckSquare,
  Square,
  FileSpreadsheet
} from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { EmptyState } from '../../../components/common/EmptyState';
import { AnalysisResult } from '../../../components/analysis/AnalysisResult';
import { historyService } from '../../../services/history/historyService';
import { formatDate } from '../../../utils/formatters';
import { useNotification } from '../../../context/NotificationContext';

export function HistoryPage() {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Modal states
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const { notify } = useNotification();

  // Load and query records
  const loadRecords = async () => {
    const results = await historyService.query({
      search: searchQuery,
      contentType: selectedType,
      status: selectedStatus,
      sortBy
    });
    setRecords(results);
    setSelectedIds(new Set());
  };

  useEffect(() => {
    loadRecords();
  }, [searchQuery, selectedType, selectedStatus, sortBy]);

  // Bulk Selection Handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.size === records.length && records.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(records.map(r => r.id)));
    }
  };

  const handleToggleSelectRow = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;
    await historyService.delete(recordToDelete.id);
    notify({
      title: 'Record Deleted',
      message: `Analysis record ${recordToDelete.id} removed from history.`,
      type: 'info'
    });
    setRecordToDelete(null);
    loadRecords();
  };

  const handleBulkDeleteConfirm = async () => {
    for (const id of Array.from(selectedIds)) {
      await historyService.delete(id);
    }
    notify({
      title: 'Bulk Deletion Complete',
      message: `Removed ${selectedIds.size} records from history archive.`,
      type: 'info'
    });
    setIsBulkDeleteModalOpen(false);
    setSelectedIds(new Set());
    loadRecords();
  };

  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = ['ID', 'Title', 'Category', 'Status', 'Assessment', 'C2PA Signed', 'Created At'];
    const rows = records.map(r => [
      `"${r.id}"`,
      `"${(r.title || r.fileName || r.id).replace(/"/g, '""')}"`,
      `"${r.contentType}"`,
      `"${r.status || 'completed'}"`,
      `"${(r.assessment?.label || r.assessmentLabel || 'Completed').replace(/"/g, '""')}"`,
      `"${r.provenance?.available ? 'Yes' : 'No'}"`,
      `"${r.createdAt}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `traceai_history_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notify({
      title: 'CSV Export Generated',
      message: `Exported ${records.length} records to tabular CSV.`,
      type: 'success'
    });
  };

  const handleResetToDemo = () => {
    historyService.resetToDemo();
    loadRecords();
    notify({
      title: 'History Reset',
      message: 'Demonstration records restored.',
      type: 'info'
    });
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
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <PageContainer
      title="Analysis History & Search Archive"
      description="Inspect past multimodal evaluations, query historical forensic records, perform bulk management, and export audit data."
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={FileSpreadsheet} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="outline" size="sm" icon={RotateCcw} onClick={handleResetToDemo}>
            Reset Demo Data
          </Button>
        </div>
      }
    >
      {/* Search & Filter Toolbar */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, ID, filename, or observation label..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              aria-label="Filter by content category"
            >
              <option value="all">All Categories</option>
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="video">Video</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              aria-label="Filter by evaluation status"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="inconclusive">Inconclusive</option>
            </select>

            {/* Sort Order */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              aria-label="Sort order"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary & Bulk Actions */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <span>Showing <strong className="text-slate-800 font-mono tabular-nums">{records.length}</strong> analysis records</span>
            {selectedIds.size > 0 && (
              <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                {selectedIds.size} selected
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {selectedIds.size > 0 && (
              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={() => setIsBulkDeleteModalOpen(true)}
              >
                Delete Selected ({selectedIds.size})
              </Button>
            )}

            {(searchQuery || selectedType !== 'all' || selectedStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setSelectedStatus('all');
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* History Table or Empty State */}
      {records.length === 0 ? (
        <EmptyState
          title="No Matching Analysis Records"
          description="We couldn't find any evaluation records matching your search and filter criteria."
          actionLabel="Clear Filter Criteria"
          onAction={() => {
            setSearchQuery('');
            setSelectedType('all');
            setSelectedStatus('all');
          }}
        />
      ) : (
        <Card bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === records.length && records.length > 0}
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      aria-label="Select all records"
                    />
                  </th>
                  <th className="py-3 px-4">Record / Subject</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Observation Assessment</th>
                  <th className="py-3 px-4">Provenance</th>
                  <th className="py-3 px-4">Analysis Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((record) => {
                  const isChecked = selectedIds.has(record.id);
                  return (
                    <tr
                      key={record.id}
                      className={`transition-colors ${
                        isChecked ? 'bg-blue-50/40 hover:bg-blue-50/60' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelectRow(record.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          aria-label={`Select record ${record.id}`}
                        />
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                            {getCategoryIcon(record.contentType)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 truncate max-w-[200px]">
                              {record.title || record.fileName || record.id}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">
                              {record.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="capitalize font-medium text-slate-700">
                          {record.contentType}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-800 font-medium">
                          {record.assessment?.label || record.assessmentLabel || 'Completed'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {record.provenance?.available ? (
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>C2PA Signed</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">Unsigned</span>
                        )}
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
                            onClick={() => setSelectedRecord(record)}
                            title="Inspect Analysis Details"
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Trash2}
                            onClick={() => setRecordToDelete(record)}
                            title="Delete Record"
                            className="hover:text-rose-600 hover:bg-rose-50"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Detail Inspection Modal */}
      {selectedRecord && (
        <Modal
          isOpen={Boolean(selectedRecord)}
          onClose={() => setSelectedRecord(null)}
          title={`Forensic Audit — ${selectedRecord.title || selectedRecord.id}`}
          subtitle={`Analyzed on ${formatDate(selectedRecord.createdAt)} · Category: ${selectedRecord.contentType}`}
          maxWidth="max-w-3xl"
          footer={
            <Button variant="secondary" size="sm" onClick={() => setSelectedRecord(null)}>
              Close
            </Button>
          }
        >
          <AnalysisResult result={selectedRecord} />
        </Modal>
      )}

      {/* Single Delete Confirmation Modal */}
      {recordToDelete && (
        <Modal
          isOpen={Boolean(recordToDelete)}
          onClose={() => setRecordToDelete(null)}
          title="Confirm Record Deletion"
          subtitle="Are you sure you want to remove this analysis record?"
          maxWidth="max-w-md"
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setRecordToDelete(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteConfirm}>
                Delete Record
              </Button>
            </>
          }
        >
          <p className="text-xs text-slate-600 leading-relaxed">
            Deleting record <strong className="text-slate-900 font-mono">{recordToDelete.id}</strong> ({recordToDelete.title || recordToDelete.contentType}) will permanently remove its audit findings and cached parameters from your session repository.
          </p>
        </Modal>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <Modal
          isOpen={isBulkDeleteModalOpen}
          onClose={() => setIsBulkDeleteModalOpen(false)}
          title="Confirm Bulk Deletion"
          subtitle={`Are you sure you want to delete ${selectedIds.size} records?`}
          maxWidth="max-w-md"
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setIsBulkDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleBulkDeleteConfirm}>
                Delete {selectedIds.size} Records
              </Button>
            </>
          }
        >
          <p className="text-xs text-slate-600 leading-relaxed">
            This action cannot be undone. All selected {selectedIds.size} analysis records and associated forensic metadata will be permanently purged from your account archive.
          </p>
        </Modal>
      )}
    </PageContainer>
  );
}

export default HistoryPage;
