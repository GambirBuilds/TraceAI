/**
 * TraceAI Advanced Text Intelligence Workspace
 * Sentence-level interactive highlighting, finding navigation, paragraph comparison,
 * writing consistency metrics, language identification, and summary export.
 */

import React, { useState } from 'react';
import {
  FileText,
  Clipboard,
  Trash2,
  Copy,
  Download,
  Info,
  ChevronLeft,
  ChevronRight,
  Search,
  BookOpen,
  Check,
  AlertTriangle,
  Languages,
  Layers,
  Sparkles
} from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { ProgressIndicator } from '../../../components/common/ProgressIndicator';
import { ErrorState } from '../../../components/common/ErrorState';
import { AnalysisResult } from '../../../components/analysis/AnalysisResult';
import { useAnalysis } from '../../../hooks/useAnalysis';
import { countCharacters, countWords } from '../../../utils/formatters';
import { validateTextInput } from '../../../utils/validators';
import { SAMPLE_TEXTS } from '../../../utils/sampleData';
import { MIN_TEXT_LENGTH } from '../../../utils/constants';
import { useNotification } from '../../../context/NotificationContext';
import { reportService } from '../../../services/reports/reportService';
import { WritingPercentageBreakdown } from '../components/WritingPercentageBreakdown';

export function TextDetectorPage() {
  const [text, setText] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [activeTab, setActiveTab] = useState('breakdown'); // 'breakdown', 'interactive', 'findings', 'paragraphs'
  const [selectedSentenceIdx, setSelectedSentenceIdx] = useState(0);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const { notify } = useNotification();

  const {
    status,
    progressStep,
    progressPercent,
    result,
    error: analysisError,
    runAnalysis,
    resetAnalysis
  } = useAnalysis('text');

  const charCount = countCharacters(text);
  const wordCount = countWords(text);

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (validationError) setValidationError(null);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setText(clipboardText);
        setValidationError(null);
      }
    } catch {
      setValidationError('Clipboard read permission was not granted. Please paste directly using Ctrl+V or Cmd+V.');
    }
  };

  const handleClear = () => {
    setText('');
    setValidationError(null);
    setSelectedSentenceIdx(0);
    resetAnalysis();
  };

  const handleLoadSample = (sampleText) => {
    setText(sampleText);
    setValidationError(null);
    setSelectedSentenceIdx(0);
    resetAnalysis();
  };

  const handleAnalyze = async () => {
    const validation = validateTextInput(text);
    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }
    setValidationError(null);
    setSelectedSentenceIdx(0);
    await runAnalysis(text);
  };

  const sentences = result?.sentences || [];
  const paragraphs = result?.paragraphs || [];
  const highlightedSentences = sentences.filter(s => s.hasMarker || s.isOutlier);

  const handleNextFinding = () => {
    if (highlightedSentences.length === 0) return;
    const currentHighIndex = highlightedSentences.findIndex(s => s.index === selectedSentenceIdx);
    const nextIdx = (currentHighIndex + 1) % highlightedSentences.length;
    setSelectedSentenceIdx(highlightedSentences[nextIdx].index);
  };

  const handlePrevFinding = () => {
    if (highlightedSentences.length === 0) return;
    const currentHighIndex = highlightedSentences.findIndex(s => s.index === selectedSentenceIdx);
    const prevIdx = (currentHighIndex - 1 + highlightedSentences.length) % highlightedSentences.length;
    setSelectedSentenceIdx(highlightedSentences[prevIdx].index);
  };

  const handleCopySummary = async () => {
    if (!result) return;
    const summary = [
      `TraceAI Text Intelligence Dossier`,
      `Record ID: ${result.id}`,
      `Assessment: ${result.assessment?.label || 'Completed'}`,
      `Writing Breakdown: AI-like ${result.breakdown?.aiPercentage ?? 'N/A'}% | Human-like ${result.breakdown?.humanPercentage ?? 'N/A'}% | Uncertain ${result.breakdown?.uncertainPercentage ?? 'N/A'}%`,
      `Language: ${result.language?.name || 'English'} (${result.language?.isSupported ? 'Supported' : 'Unverified'})`,
      `Model: ${result.model?.name || 'Standard Linguistic Engine'}`,
      `Sentence Count: ${result.stylometrics?.sentenceCount || sentences.length}`,
      `Average Sentence Length: ${result.stylometrics?.avgSentenceLength || 'N/A'} words`,
      `Burstiness / Variance: ${result.stylometrics?.variance || 'N/A'}`,
      `Repetitive Markers: ${result.stylometrics?.detectedMarkers?.join(', ') || 'None flagged'}`,
      `Observations: ${result.findings?.map(f => f.title + ': ' + f.description).join(' | ')}`
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      setCopiedSummary(true);
      notify({
        title: 'Summary Copied',
        message: 'Analysis findings copied to system clipboard.',
        type: 'success'
      });
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch {
      notify({
        title: 'Clipboard Error',
        message: 'Unable to write to clipboard.',
        type: 'error'
      });
    }
  };

  const selectedSentence = sentences.find(s => s.index === selectedSentenceIdx) || sentences[0];

  return (
    <PageContainer
      title="Advanced Text Intelligence"
      description="Inspect sentence-level stylometry, burstiness variance, writing consistency across paragraphs, and formulaic rhetorical transitions."
      actions={
        result && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              icon={copiedSummary ? Check : Copy}
              onClick={handleCopySummary}
            >
              {copiedSummary ? 'Copied' : 'Copy Summary'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              icon={Download}
              onClick={() => reportService.downloadJsonReport(result)}
            >
              Export Dossier
            </Button>
          </div>
        )
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Editor Workspace */}
        <div className="lg:col-span-6 space-y-4">
          <Card
            title="Content Input Editor"
            subtitle="Paste text to inspect stylometry, transition markers, and linguistic consistency (minimum 50 characters)"
            action={
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Clipboard}
                  onClick={handlePaste}
                  title="Paste from clipboard"
                >
                  Paste
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={handleClear}
                  disabled={!text}
                  title="Clear text"
                >
                  Clear
                </Button>
              </div>
            }
          >
            {/* Sample Selector Bar */}
            <div className="mb-3 flex flex-wrap items-center gap-2 pb-3 border-b border-slate-100">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                Load Sample:
              </span>
              {SAMPLE_TEXTS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleLoadSample(sample.text)}
                  className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                >
                  {sample.title}
                </button>
              ))}
            </div>

            {/* Text Area */}
            <div className="relative">
              <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Enter or paste text here to inspect stylometric regularities, formulaic phrasing, and syntactic burstiness..."
                rows={11}
                disabled={status === 'analyzing'}
                className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans resize-y leading-relaxed"
              />
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <div className="mt-2.5 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Counter Bar & Submit */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs font-mono tabular-nums text-slate-500">
                <span>
                  Words: <strong className="text-slate-800">{wordCount}</strong>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Characters: <strong className="text-slate-800">{charCount}</strong>
                </span>
                <span aria-hidden="true">·</span>
                <span className={charCount < MIN_TEXT_LENGTH ? 'text-amber-600' : 'text-emerald-600'}>
                  {charCount >= MIN_TEXT_LENGTH ? 'Valid length' : `Min ${MIN_TEXT_LENGTH} chars`}
                </span>
              </div>

              <Button
                variant="primary"
                onClick={handleAnalyze}
                disabled={!text.trim() || status === 'analyzing'}
                isLoading={status === 'analyzing'}
                icon={Search}
              >
                Analyze Text
              </Button>
            </div>
          </Card>

          {/* Linguistic Methodology & Model Info */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 space-y-2">
            <div className="font-semibold text-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Sentence-Level Stylometry & Burstiness</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Zero Fabricated Percentages</span>
            </div>
            <p className="leading-relaxed">
              TraceAI investigates sentence-level length variance (burstiness) and rhetorical transition frequencies.
              When sentences maintain uniform word counts and predictable transitions, our models flag elevated structural regularity.
              Human authors naturally display irregular cadence and stylistic variance.
            </p>
          </div>
        </div>

        {/* Right Column: Advanced Intelligence Viewer & Findings */}
        <div className="lg:col-span-6 space-y-4">
          {status === 'idle' && (
            <Card className="h-full flex flex-col items-center justify-center text-center p-8 min-h-[380px]">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">
                Awaiting Text Submission
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
                Enter your text in the input editor and click "Analyze Text", or choose one of the pre-configured samples to inspect sentence-level stylometry.
              </p>
            </Card>
          )}

          {status === 'analyzing' && (
            <div className="min-h-[380px] flex items-center justify-center">
              <ProgressIndicator
                percent={progressPercent}
                step={progressStep}
                category="sentence stylometry & burstiness"
              />
            </div>
          )}

          {status === 'error' && (
            <ErrorState
              title="Text Evaluation Failed"
              message={analysisError}
              onRetry={handleAnalyze}
            />
          )}

          {status === 'completed' && result && (
            <div className="space-y-4">
              {/* Language & Overview Strip */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-blue-600" />
                    <span className="text-slate-500">Language:</span>
                    <strong className="text-slate-800">{result.language?.name || 'English'}</strong>
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                      Supported
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                    <span>Model: {result.model?.name || 'Stylometric Engine'}</span>
                    <span aria-hidden="true">·</span>
                    <span>Status: {result.assessment?.label}</span>
                  </div>
                </div>

                {/* Stylometric KPI Strip */}
                {result.stylometrics && (
                  <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <div className="text-[10px] text-slate-400 uppercase">Avg Sent Len</div>
                      <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                        {result.stylometrics.avgSentenceLength} <span className="text-[10px] font-normal text-slate-500">wds</span>
                      </div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <div className="text-[10px] text-slate-400 uppercase">Burstiness</div>
                      <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                        {result.stylometrics.variance}
                      </div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <div className="text-[10px] text-slate-400 uppercase">TTR Vocab</div>
                      <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                        {result.stylometrics.vocabularyDiversity}
                      </div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <div className="text-[10px] text-slate-400 uppercase">Markers</div>
                      <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                        {result.stylometrics.detectedMarkers?.length || 0}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* View Mode Segmented Controls */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                  <button
                    onClick={() => setActiveTab('breakdown')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      activeTab === 'breakdown'
                        ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    AI vs Human Breakdown
                  </button>
                  <button
                    onClick={() => setActiveTab('interactive')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      activeTab === 'interactive'
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Interactive Sentence Viewer
                  </button>
                  <button
                    onClick={() => setActiveTab('paragraphs')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      activeTab === 'paragraphs'
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Paragraph Cadence ({paragraphs.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('findings')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      activeTab === 'findings'
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All Findings ({result.findings?.length || 0})
                  </button>
                </div>

                {activeTab === 'interactive' && highlightedSentences.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                    <span>
                      {highlightedSentences.findIndex(s => s.index === selectedSentenceIdx) + 1} / {highlightedSentences.length}
                    </span>
                    <button
                      onClick={handlePrevFinding}
                      className="p-1 rounded hover:bg-slate-100 text-slate-600"
                      title="Previous highlighted finding"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleNextFinding}
                      className="p-1 rounded hover:bg-slate-100 text-slate-600"
                      title="Next highlighted finding"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* TAB 0: AI vs Human Writing Percentage Breakdown */}
              {activeTab === 'breakdown' && (
                <WritingPercentageBreakdown
                  breakdown={result.breakdown}
                  onSentenceSelect={(sentNum) => {
                    setSelectedSentenceIdx(sentNum - 1);
                  }}
                  selectedSentenceNumber={selectedSentenceIdx + 1}
                />
              )}

              {/* TAB 1: Interactive Sentence Viewer */}
              {activeTab === 'interactive' && (
                <div className="space-y-4">
                  <Card
                    title="Interactive Passage Explorer"
                    subtitle="Click any sentence to inspect its length, transition phrases, and stylometric profile"
                  >
                    <div className="p-4 bg-slate-50/50 rounded-lg text-sm text-slate-800 leading-relaxed max-h-72 overflow-y-auto font-serif">
                      {sentences.map((sent) => {
                        const isSelected = sent.index === selectedSentenceIdx;
                        const isHighlighted = sent.hasMarker || sent.isOutlier;

                        let styleClasses = 'cursor-pointer transition-colors px-0.5 rounded ';
                        if (isSelected) {
                          styleClasses += 'bg-blue-200 text-blue-950 font-medium ring-2 ring-blue-400 ';
                        } else if (isHighlighted) {
                          styleClasses += 'bg-amber-100/80 text-amber-950 hover:bg-amber-200 ';
                        } else {
                          styleClasses += 'hover:bg-slate-200/60 ';
                        }

                        return (
                          <span
                            key={sent.index}
                            onClick={() => setSelectedSentenceIdx(sent.index)}
                            className={styleClasses}
                            title={`Sentence #${sent.index + 1}: ${sent.wordCount} words`}
                          >
                            {sent.text}{' '}
                          </span>
                        );
                      })}
                    </div>

                    {/* Selected Sentence Inspector Box */}
                    {selectedSentence && (
                      <div className="mt-4 p-3.5 bg-blue-50/50 border border-blue-200/70 rounded-xl text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-blue-900 font-semibold">
                          <span>Sentence #{selectedSentence.index + 1} Profile</span>
                          <span className="font-mono text-[11px] text-blue-700">
                            {selectedSentence.wordCount} words · chars {selectedSentence.startChar}–{selectedSentence.endChar}
                          </span>
                        </div>
                        <p className="text-slate-700 italic">
                          "{selectedSentence.text}"
                        </p>
                        <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-slate-600">
                          <span>{selectedSentence.observation}</span>
                          {selectedSentence.hasMarker && (
                            <span className="text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-mono text-[10px]">
                              Marker: {selectedSentence.markerName}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* TAB 2: Paragraph Cadence */}
              {activeTab === 'paragraphs' && (
                <Card
                  title="Cross-Paragraph Cadence & Consistency"
                  subtitle="Structural variation and sentence distribution across document paragraphs"
                >
                  <div className="space-y-3">
                    {paragraphs.map((para) => (
                      <div
                        key={para.index}
                        className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-800">
                            Paragraph #{para.index + 1}
                          </div>
                          <div className="text-slate-500 mt-0.5">
                            {para.sentenceCount} sentence(s) · {para.wordCount} total words
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-slate-900">
                            {para.avgWordsPerSentence} <span className="text-[10px] font-normal text-slate-400">words/sentence</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Cadence density
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* TAB 3: Full Findings & Audit */}
              {activeTab === 'findings' && (
                <AnalysisResult
                  result={result}
                  onReset={handleClear}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default TextDetectorPage;
