/**
 * TraceAI Writing Percentage Breakdown
 * Calibrated AI vs Human Writing Breakdown with sentence-level classification,
 * Largest Remainder 100% normalization, Recharts visual analytics, and mandatory disclaimer.
 */

import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import {
  AlertTriangle,
  Info,
  CheckCircle2,
  HelpCircle,
  Cpu,
  User,
  Sliders,
  ChevronDown,
  ChevronUp,
  Filter,
  BarChart2,
  PieChart as PieIcon,
  Sparkles
} from 'lucide-react';
import { Card } from '../../../components/common/Card';

const COLORS = {
  ai: '#6366F1', // Indigo / Purple for AI-like
  human: '#10B981', // Emerald for Human-like
  uncertain: '#F59E0B' // Amber for Uncertain / Mixed
};

export function WritingPercentageBreakdown({ breakdown, onSentenceSelect, selectedSentenceNumber }) {
  const [filter, setFilter] = useState('all'); // 'all', 'ai-like', 'human-like', 'inconclusive'
  const [showMethodology, setShowMethodology] = useState(false);
  const [activeSentence, setActiveSentence] = useState(null);

  if (!breakdown) {
    return (
      <Card className="p-6 text-center text-slate-500 text-xs">
        No writing breakdown data available for this analysis.
      </Card>
    );
  }

  const {
    totalSentences = 0,
    aiPercentage = 0,
    humanPercentage = 0,
    uncertainPercentage = 0,
    aiLikeCount = 0,
    humanLikeCount = 0,
    inconclusiveCount = 0,
    sentences = [],
    overallExplanation = '',
    aggregationMethod = '',
    disclaimer = ''
  } = breakdown;

  // Prepare Pie Chart data (omit 0% slices for clean aesthetics)
  const pieData = [
    { name: 'Human-like', value: humanPercentage, count: humanLikeCount, color: COLORS.human },
    { name: 'Uncertain / Mixed', value: uncertainPercentage, count: inconclusiveCount, color: COLORS.uncertain },
    { name: 'AI-like', value: aiPercentage, count: aiLikeCount, color: COLORS.ai }
  ].filter(item => item.value > 0);

  // Prepare Sentence Distribution Chart data
  const distributionData = sentences.map((s) => ({
    name: `S${s.sentenceNumber}`,
    sentenceNumber: s.sentenceNumber,
    aiLikelihood: Math.round((s.aiLikelihood || 0.5) * 100),
    classification: s.classification,
    wordCount: s.wordCount,
    text: s.text
  }));

  // Filter sentences
  const filteredSentences = sentences.filter(s => {
    if (filter === 'all') return true;
    return s.classification === filter;
  });

  const handleSentenceClick = (sent) => {
    setActiveSentence(sent);
    if (onSentenceSelect) {
      onSentenceSelect(sent.sentenceNumber);
    }
  };

  const currentSelected = activeSentence || 
    (selectedSentenceNumber ? sentences.find(s => s.sentenceNumber === selectedSentenceNumber) : null) || 
    sentences[0];

  return (
    <div className="space-y-5">
      {/* 1. Mandatory Disclaimer Banner */}
      <div className="p-4 bg-amber-50/90 border border-amber-200/80 rounded-xl text-amber-900 text-xs flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-amber-950 flex items-center gap-2">
            <span>Model Probability & Authorship Disclaimer</span>
            <span className="text-[10px] font-mono uppercase bg-amber-200/70 text-amber-800 px-1.5 py-0.5 rounded">
              Standard Guideline
            </span>
          </div>
          <p className="leading-relaxed text-amber-900/90 font-sans">
            {disclaimer || 'AI and human writing percentages are estimates based on available detection models and linguistic patterns. They do not establish who wrote the content. Human-edited AI text and AI-like human writing may produce uncertain or misleading results.'}
          </p>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Human-like Card */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              Human-like
            </span>
            <span className="text-[11px] font-mono text-slate-400">{humanLikeCount} sent.</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-700">{humanPercentage}%</span>
            <span className="text-[11px] text-slate-400 font-sans">estimate</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${humanPercentage}%` }}
            />
          </div>
        </div>

        {/* AI-like Card */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              AI-like
            </span>
            <span className="text-[11px] font-mono text-slate-400">{aiLikeCount} sent.</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-indigo-700">{aiPercentage}%</span>
            <span className="text-[11px] text-slate-400 font-sans">estimate</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${aiPercentage}%` }}
            />
          </div>
        </div>

        {/* Uncertain / Mixed Card */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              Uncertain / Mixed
            </span>
            <span className="text-[11px] font-mono text-slate-400">{inconclusiveCount} sent.</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-amber-700">{uncertainPercentage}%</span>
            <span className="text-[11px] text-slate-400 font-sans">inconclusive</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${uncertainPercentage}%` }}
            />
          </div>
        </div>

        {/* Total Analyzed Sentences Card */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-600" />
              Total Sentences
            </span>
            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1 rounded">100% Normalized</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900">{totalSentences}</span>
            <span className="text-[11px] text-slate-400 font-sans">units</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 truncate">
            Sum: {aiPercentage + humanPercentage + uncertainPercentage}% (Exact 100%)
          </p>
        </div>
      </div>

      {/* 3. Horizontal Segmented Percentage Comparison Bar */}
      <Card title="Calibrated Writing Composition Ratio" subtitle="Normalized multi-tier sentence share (Largest Remainder aggregation)">
        <div className="space-y-2.5">
          {/* Segmented bar */}
          <div className="h-6 w-full bg-slate-100 rounded-lg overflow-hidden flex shadow-inner">
            {humanPercentage > 0 && (
              <div
                style={{ width: `${humanPercentage}%` }}
                className="bg-emerald-500 hover:bg-emerald-600 transition-all flex items-center justify-center text-[11px] font-mono font-bold text-white relative group cursor-pointer"
                title={`Human-like: ${humanPercentage}% (${humanLikeCount} sentences)`}
              >
                {humanPercentage >= 8 ? `${humanPercentage}%` : ''}
              </div>
            )}
            {uncertainPercentage > 0 && (
              <div
                style={{ width: `${uncertainPercentage}%` }}
                className="bg-amber-500 hover:bg-amber-600 transition-all flex items-center justify-center text-[11px] font-mono font-bold text-white relative group cursor-pointer"
                title={`Uncertain/Mixed: ${uncertainPercentage}% (${inconclusiveCount} sentences)`}
              >
                {uncertainPercentage >= 8 ? `${uncertainPercentage}%` : ''}
              </div>
            )}
            {aiPercentage > 0 && (
              <div
                style={{ width: `${aiPercentage}%` }}
                className="bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center justify-center text-[11px] font-mono font-bold text-white relative group cursor-pointer"
                title={`AI-like: ${aiPercentage}% (${aiLikeCount} sentences)`}
              >
                {aiPercentage >= 8 ? `${aiPercentage}%` : ''}
              </div>
            )}
          </div>

          {/* Bar Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs pt-1 text-slate-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                <span className="font-medium text-slate-800">Human-like:</span>
                <span className="font-mono">{humanPercentage}%</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
                <span className="font-medium text-slate-800">Uncertain / Mixed:</span>
                <span className="font-mono">{uncertainPercentage}%</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-indigo-600 inline-block" />
                <span className="font-medium text-slate-800">AI-like:</span>
                <span className="font-mono">{aiPercentage}%</span>
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Total: {humanPercentage + uncertainPercentage + aiPercentage}%
            </div>
          </div>
        </div>

        {/* Overall Explanation Callout */}
        {overallExplanation && (
          <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-slate-700 leading-relaxed flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Synthesis Explanation: </span>
              {overallExplanation}
            </div>
          </div>
        )}
      </Card>

      {/* 4. Dual Charts: Doughnut Chart & Sentence Distribution Chart */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Doughnut Chart */}
        <div className="md:col-span-5">
          <Card title="Composition Distribution" subtitle="Proportional sentence shares">
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value, name, item) => [`${value}% (${item.payload.count} sent.)`, name]}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1.5 border-t border-slate-100 pt-3 text-xs">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <div className="font-mono font-medium text-slate-900">
                    {item.value}% <span className="text-[10px] text-slate-400">({item.count})</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sentence Distribution Chart */}
        <div className="md:col-span-7">
          <Card
            title="Sentence-by-Sentence AI Likelihood"
            subtitle="Sequential model likelihood score across analyzed text"
          >
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={distributionData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#64748B' }}
                    interval={0}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: '#64748B' }}
                    unit="%"
                  />
                  <ReferenceLine y={65} stroke="#6366F1" strokeDasharray="3 3" label={{ value: 'AI Threshold (65%)', fill: '#6366F1', fontSize: 9, position: 'right' }} />
                  <ReferenceLine y={35} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Human Threshold (35%)', fill: '#10B981', fontSize: 9, position: 'right' }} />
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-md text-xs space-y-1">
                            <div className="font-semibold text-slate-800">
                              Sentence #{data.sentenceNumber}
                            </div>
                            <div className="font-mono text-slate-600">
                              Likelihood: <strong className="text-slate-900">{data.aiLikelihood}%</strong>
                            </div>
                            <div className="text-[11px] capitalize">
                              Class: <span className="font-medium text-indigo-700">{data.classification}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 max-w-[200px] truncate italic">
                              "{data.text}"
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="aiLikelihood"
                    radius={[4, 4, 0, 0]}
                  >
                    {distributionData.map((entry, index) => {
                      let fillColor = COLORS.uncertain;
                      if (entry.aiLikelihood >= 65) fillColor = COLORS.ai;
                      else if (entry.aiLikelihood <= 35) fillColor = COLORS.human;
                      return <Cell key={`bar-${index}`} fill={fillColor} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> ≤35% Human-like
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> 36–64% Uncertain
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" /> ≥65% AI-like
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* 5. Documented Aggregation Methodology Accordion */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
        <button
          onClick={() => setShowMethodology(!showMethodology)}
          className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-800 hover:text-blue-600 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            <span>Documented Aggregation Methodology & Integrity Standard</span>
          </div>
          {showMethodology ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showMethodology && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2.5 text-xs text-slate-600 leading-relaxed">
            <p>
              <strong>Aggregation Method:</strong> {aggregationMethod || 'Document-level percentages represent the proportion of analyzed sentences categorized into AI-like (score ≥ 0.65), human-like (score ≤ 0.35), or uncertain (0.35 < score < 0.65 or < 6 words) bins, normalized via the Largest Remainder Method to guarantee a strict 100% total.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="font-semibold text-slate-800 text-[11px]">1. Sentence Thresholds</div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Sentences scoring ≥ 0.65 are classified as AI-like. Sentences ≤ 0.35 are human-like. Sentences between 0.35 and 0.65 or shorter than 6 words remain Inconclusive.
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="font-semibold text-slate-800 text-[11px]">2. Exact 100% Math</div>
                <p className="text-[10px] text-slate-500 mt-1">
                  We use the Largest Remainder (Hare-Niemeyer) method to resolve rounding fractions, preventing off-by-one errors and guaranteeing exact 100% sum without fake numbers.
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="font-semibold text-slate-800 text-[11px]">3. Non-Binary Ethics</div>
                <p className="text-[10px] text-slate-500 mt-1">
                  TraceAI never treats human-like percentage as proof of human authorship, nor does it force uncertain or edited sentences into a false binary choice.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. Interactive Sentence-Level Inspection Workspace */}
      <Card
        title="Sentence-Level Analysis & Classification"
        subtitle="Click any sentence to inspect model indicators, AI likelihood, and linguistic explanations"
        action={
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({totalSentences})
            </button>
            <button
              onClick={() => setFilter('ai-like')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'ai-like'
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              AI-like ({aiLikeCount})
            </button>
            <button
              onClick={() => setFilter('human-like')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'human-like'
                  ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Human-like ({humanLikeCount})
            </button>
            <button
              onClick={() => setFilter('inconclusive')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'inconclusive'
                  ? 'bg-white text-amber-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inconclusive ({inconclusiveCount})
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Sentence List */}
          <div className="lg:col-span-7 space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {filteredSentences.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No sentences match the selected filter ({filter}).
              </div>
            ) : (
              filteredSentences.map((sent) => {
                const isSelected = currentSelected?.sentenceNumber === sent.sentenceNumber;
                let badgeBg = 'bg-slate-100 text-slate-700 border-slate-200';
                if (sent.classification === 'ai-like') {
                  badgeBg = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                } else if (sent.classification === 'human-like') {
                  badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                } else {
                  badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
                }

                return (
                  <div
                    key={sent.sentenceNumber}
                    onClick={() => handleSentenceClick(sent)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/40 shadow-xs ring-1 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-700">
                          #{sent.sentenceNumber}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${badgeBg} capitalize`}>
                          {sent.classification}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                        <span>{Math.round((sent.aiLikelihood || 0.5) * 100)}% AI likelihood</span>
                        <span aria-hidden="true">·</span>
                        <span>{sent.wordCount} words</span>
                      </div>
                    </div>
                    <p className="text-slate-800 line-clamp-2 leading-relaxed">
                      "{sent.text}"
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Detailed Sentence Inspector Panel */}
          <div className="lg:col-span-5">
            {currentSelected ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 sticky top-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 font-mono text-sm">
                      Sentence #{currentSelected.sentenceNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        currentSelected.classification === 'ai-like'
                          ? 'bg-indigo-100 text-indigo-800'
                          : currentSelected.classification === 'human-like'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {currentSelected.classification}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Confidence: {currentSelected.confidence || 'medium'}
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Original Sentence Text
                  </div>
                  <p className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 italic leading-relaxed font-serif">
                    "{currentSelected.text}"
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">AI-Likelihood Estimate:</span>
                    <strong className="font-mono text-slate-900">
                      {Math.round((currentSelected.aiLikelihood || 0.5) * 100)}%
                    </strong>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        currentSelected.aiLikelihood >= 0.65
                          ? 'bg-indigo-600'
                          : currentSelected.aiLikelihood <= 0.35
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.round((currentSelected.aiLikelihood || 0.5) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Model Indicators & Stylometry
                  </div>
                  <p className="text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                    {currentSelected.explanation || 'Analyzed against sentence length cadence, burstiness distribution, and formulaic transition patterns.'}
                  </p>
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Length: {currentSelected.wordCount} words</span>
                  <span>Uncertainty: {currentSelected.confidence === 'high' ? 'Low' : 'Elevated'}</span>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-6 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                Select a sentence to view detailed inspection.
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default WritingPercentageBreakdown;
