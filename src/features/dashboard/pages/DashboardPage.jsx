/**
 * TraceAI Advanced Analytics Center & Dashboard
 * Real database-backed statistics, date range filtering (today, 7d, 30d, 90d),
 * provider availability telemetry, processing performance, and recent activity.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Image,
  Mic,
  Video,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Server,
  Zap,
  Filter,
  RefreshCw,
  HelpCircle,
  FileSearch
} from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { LoadingSkeleton } from '../../../components/common/LoadingSkeleton';
import { AnalysisOverviewChart } from '../../../components/charts/AnalysisOverviewChart';
import { ContentDistributionChart } from '../../../components/charts/ContentDistributionChart';
import { analyticsService } from '../../../services/api/analyticsService';
import { formatDate } from '../../../utils/formatters';
import { useAuth } from '../../../context/AuthContext';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [dateRange, setDateRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [overviewData, setOverviewData] = useState(null);
  const [providerData, setProviderData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (range) => {
    setIsLoading(true);
    setError(null);
    try {
      const [overview, providers] = await Promise.all([
        analyticsService.getOverview(range),
        analyticsService.getProviderStatus()
      ]);
      setOverviewData(overview);
      setProviderData(providers);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError('Unable to load analytics data from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(dateRange);
  }, [dateRange]);

  const total = overviewData?.totalAnalyses ?? overviewData?.metrics?.total ?? 0;
  const completed = overviewData?.completedCount ?? overviewData?.metrics?.byStatus?.completed ?? 0;
  const inconclusive = overviewData?.inconclusiveCount ?? overviewData?.metrics?.byStatus?.inconclusive ?? 0;
  const processing = overviewData?.processingCount ?? overviewData?.metrics?.byStatus?.processing ?? 0;
  const textCount = overviewData?.textAnalyses ?? overviewData?.metrics?.byCategory?.text ?? 0;
  const imageCount = overviewData?.imageAnalyses ?? overviewData?.metrics?.byCategory?.image ?? 0;
  const audioCount = overviewData?.audioAnalyses ?? overviewData?.metrics?.byCategory?.audio ?? 0;
  const videoCount = overviewData?.videoAnalyses ?? overviewData?.metrics?.byCategory?.video ?? 0;
  const latency = overviewData?.avgProcessingLatencyMs ?? overviewData?.metrics?.avgProcessingDurationMs ?? 0;
  const trendData = overviewData?.trend ?? overviewData?.trendData ?? [];
  const distributionData = overviewData?.typeDistribution ?? overviewData?.distribution ?? [];

  const statCards = [
    {
      title: 'Total Analyses',
      value: total,
      subtext: `${completed} completed · ${inconclusive} inconclusive`,
      category: 'all'
    },
    {
      title: 'Text Investigations',
      value: textCount,
      subtext: total > 0 ? `${Math.round((textCount / total) * 100)}% of volume` : '0% of volume',
      category: 'text'
    },
    {
      title: 'Image Forensics',
      value: imageCount,
      subtext: total > 0 ? `${Math.round((imageCount / total) * 100)}% of volume` : '0% of volume',
      category: 'image'
    },
    {
      title: 'Audio Synthetics',
      value: audioCount,
      subtext: total > 0 ? `${Math.round((audioCount / total) * 100)}% of volume` : '0% of volume',
      category: 'audio'
    },
    {
      title: 'Video Manipulations',
      value: videoCount,
      subtext: total > 0 ? `${Math.round((videoCount / total) * 100)}% of volume` : '0% of volume',
      category: 'video'
    }
  ];

  const tools = [
    {
      id: 'text',
      title: 'Text Detector',
      description: 'Sentence-level stylometry, burstiness, and formulaic rhetorical markers.',
      icon: FileText,
      path: '/app/text',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'image',
      title: 'Image Detector',
      description: 'EXIF metadata inspection, diffusion noise, and C2PA Content Credentials.',
      icon: Image,
      path: '/app/image',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'audio',
      title: 'Audio Detector',
      description: 'Waveform scrubbers, vocoder continuity, and acoustic resonance.',
      icon: Mic,
      path: '/app/audio',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      id: 'video',
      title: 'Video Detector',
      description: '3-pane synchronized timeline, keyframe forensics, and lip sync.',
      icon: Video,
      path: '/app/video',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const formatLatency = (ms) => {
    if (!ms || ms === 0) return '—';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <PageContainer
      title={`Intelligence Overview`}
      description={`Authenticated as ${user?.name || 'Analyst'} (${user?.role?.replace('_', ' ') || 'member'}). Real-time database telemetry and content investigation metrics.`}
      actions={
        <div className="flex items-center gap-2">
          {/* Date Filter Segmented Controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            {[
              { id: 'today', label: 'Today' },
              { id: '7d', label: 'Last 7d' },
              { id: '30d', label: 'Last 30d' },
              { id: '90d', label: 'Last 90d' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setDateRange(tab.id)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  dateRange === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="ghost"
            icon={RefreshCw}
            onClick={() => fetchData(dateRange)}
            className="text-slate-500"
            title="Refresh database metrics"
          />
        </div>
      }
    >
      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => navigate(tool.path)}
              className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg ${tool.bgColor} ${tool.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {tool.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-medium text-blue-600">
                <span>Launch Analysis</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Metrics Row */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-900">Database Investigation Volume</span>
            <span aria-hidden="true">·</span>
            <span>Range: {dateRange.toUpperCase()}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">Avg Latency: {formatLatency(latency)}</span>
          </div>
          {processing > 0 && (
            <span className="text-xs text-blue-600 font-medium">
              {processing} queue jobs running
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-white border border-slate-200 rounded-xl p-4 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {statCards.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs"
              >
                <div className="text-xs text-slate-500 truncate">{stat.title}</div>
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                  {stat.value}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">
                  {stat.subtext}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Trend Chart */}
        <div className="lg:col-span-2">
          <Card
            title="Analysis Volume Activity"
            subtitle={`Daily and monthly evaluation frequency over ${dateRange.toUpperCase()}`}
            action={
              <span className="text-xs text-slate-400 font-mono">Live PostgreSQL Store</span>
            }
          >
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <LoadingSkeleton count={4} className="h-10 w-full" />
              </div>
            ) : trendData && trendData.length > 0 ? (
              <AnalysisOverviewChart data={trendData} />
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <FileSearch className="w-8 h-8 mb-2 stroke-1 text-slate-300" />
                <p className="text-xs">No analysis events recorded in this time range.</p>
                <p className="text-[11px] text-slate-400 mt-1">Submit content to generate inspection telemetry.</p>
              </div>
            )}
          </Card>
        </div>

        {/* Content Distribution */}
        <div>
          <Card
            title="Media Distribution"
            subtitle="Volume percentage across content types"
          >
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin" />
              </div>
            ) : total > 0 && distributionData && distributionData.length > 0 ? (
              <ContentDistributionChart distribution={distributionData} />
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <p className="text-xs">No media breakdown available yet.</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Provider Availability & Engine Health Strip */}
      {providerData && (
        <div className="mb-8 p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-semibold text-slate-900">Configured Intelligence Providers & Engines</h3>
            </div>
            <div className="text-xs text-slate-500">
              System status: <span className="font-medium text-emerald-700 capitalize">{providerData.systemHealth || 'Operational'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {providerData.providers?.map((p, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{p.name}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      p.status === 'operational'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 capitalize">
                    {p.category} · {p.mode || 'Direct Engine'}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 font-mono">
                  {p.details || 'Active model connector'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Analysis Activity Table */}
      <Card
        title="Recent Analysis Activity"
        subtitle="Recent content investigations recorded in the system"
        action={
          <Link
            to="/app/history"
            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Open History Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Subject / Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Assessment Observation</th>
                <th className="py-3 px-4">Provenance</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <LoadingSkeleton count={3} className="h-6 w-full mb-2" />
                  </td>
                </tr>
              ) : overviewData?.recentAnalyses && overviewData.recentAnalyses.length > 0 ? (
                overviewData.recentAnalyses.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div className="truncate max-w-[200px]">
                        {record.title || record.fileName || record.id}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize text-slate-700 font-medium">
                        {record.contentType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-800">
                        {record.assessment?.label || record.assessmentLabel || 'Analyzed'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {record.provenance?.available ? (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>C2PA Signed</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Unsigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 tabular-nums font-mono text-slate-500">
                      {formatDate(record.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/app/history"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No analyses performed yet. Use the tools above to run your first evaluation.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </PageContainer>
  );
}

export default DashboardPage;
