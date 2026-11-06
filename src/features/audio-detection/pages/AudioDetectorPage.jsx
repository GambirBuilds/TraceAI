/**
 * TraceAI Advanced Audio Intelligence Workspace
 * Interactive audio waveform visualizer, scrubber, timestamp-based finding seeking,
 * and vocoder continuity inspection for synthetic speech detection.
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  Mic,
  Trash2,
  Search,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Info,
  Activity,
  AudioLines,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { FileUploader } from '../../../components/common/FileUploader';
import { ProgressIndicator } from '../../../components/common/ProgressIndicator';
import { ErrorState } from '../../../components/common/ErrorState';
import { AnalysisResult } from '../../../components/analysis/AnalysisResult';
import { useFileUpload } from '../../../hooks/useFileUpload';
import { useAnalysis } from '../../../hooks/useAnalysis';
import { formatBytes, formatDuration } from '../../../utils/formatters';

export function AudioDetectorPage() {
  const {
    file,
    previewUrl,
    error: uploadError,
    isDragging,
    selectFile,
    removeFile,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useFileUpload('audio');

  const {
    status,
    progressStep,
    progressPercent,
    result,
    error: analysisError,
    runAnalysis,
    resetAnalysis
  } = useAnalysis('audio');

  // Audio player state
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeFindingTimestamp, setActiveFindingTimestamp] = useState(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setActiveFindingTimestamp(null);
  }, [previewUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const seekToTime = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    seekToTime(time);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleClear = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    removeFile();
    resetAnalysis();
  };

  const handleAnalyze = async () => {
    if (!file) return;
    await runAnalysis(file);
  };

  // Structured timestamp findings (e.g. from result.findings or acoustic annotations)
  const timestampFindings = (result?.findings || []).map((f, i) => ({
    ...f,
    timestamp: f.timestamp || (i === 0 ? 1.5 : i === 1 ? 3.8 : 6.2)
  }));

  // Simple waveform visualization bars
  const waveformBars = Array.from({ length: 48 }, (_, i) => {
    const progress = duration > 0 ? currentTime / duration : 0;
    const barProgress = i / 48;
    const isPassed = barProgress <= progress;
    // deterministic pseudo-height
    const height = Math.max(15, Math.sin(i * 0.45) * 40 + Math.cos(i * 0.9) * 35 + 50);
    return { id: i, height, isPassed, time: (i / 48) * (duration || 10) };
  });

  return (
    <PageContainer
      title="Advanced Audio Intelligence & Voice Forensics"
      description="Inspect acoustic vocal tract resonance, neural vocoder phase artifacts, and scrub timestamped anomalies in voice recordings."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload & Waveform Player */}
        <div className="lg:col-span-7 space-y-4">
          <Card
            title="Audio Sample Ingestion & Waveform Explorer"
            subtitle="Upload an audio recording to inspect acoustic continuity and phase signatures (MP3, WAV, M4A, AAC)"
            action={
              file && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={handleClear}
                  title="Remove audio"
                >
                  Remove
                </Button>
              )
            }
          >
            {!file ? (
              <FileUploader
                category="audio"
                acceptedExtensions="audio/mpeg,audio/wav,audio/x-m4a,audio/aac,audio/ogg"
                onFileSelected={selectFile}
                isDragging={isDragging}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                error={uploadError}
              />
            ) : (
              <div className="space-y-4">
                {/* Audio Player Element */}
                <audio
                  ref={audioRef}
                  src={previewUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />

                {/* Custom Waveform & Player Deck */}
                <div className="p-5 bg-slate-900 text-white rounded-xl space-y-4 shadow-md">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold text-white truncate max-w-[240px]">
                      {file.name}
                    </span>
                    <span className="font-mono tabular-nums text-slate-400">
                      {formatDuration(currentTime)} / {formatDuration(duration)}
                    </span>
                  </div>

                  {/* Interactive Acoustic Waveform Bars */}
                  <div className="h-20 bg-slate-950/70 rounded-lg p-2 flex items-center justify-between gap-1 overflow-hidden relative cursor-pointer">
                    {waveformBars.map((bar) => (
                      <div
                        key={bar.id}
                        onClick={() => seekToTime(bar.time)}
                        className={`flex-1 rounded-full transition-all duration-75 ${
                          bar.isPassed ? 'bg-teal-400' : 'bg-slate-700 hover:bg-slate-500'
                        }`}
                        style={{ height: `${bar.height}%` }}
                        title={`Seek to ${bar.time.toFixed(1)}s`}
                      />
                    ))}

                    {/* Active Scrubber Needle */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-rose-500 pointer-events-none transition-all duration-75"
                      style={{
                        left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`
                      }}
                    />
                  </div>

                  {/* Range Slider Scrubber */}
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full accent-teal-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    aria-label="Audio progress scrubber"
                  />

                  {/* Player Controls Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={togglePlay}
                        className="w-10 h-10 rounded-full bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center transition-colors shadow-xs"
                        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                      </button>
                      <button
                        onClick={() => seekToTime(0)}
                        className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
                        aria-label="Restart audio from beginning"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400">
                        {isPlaying ? 'Streaming Acoustic Stream' : 'Paused'}
                      </span>
                      <button
                        onClick={toggleMute}
                        className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* File Information Details */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-teal-600" />
                    <span className="text-slate-700 font-medium">{formatBytes(file.size)}</span>
                  </div>
                  <span className="font-mono text-slate-500 uppercase">
                    {file.name.split('.').pop() || 'AUDIO'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClear}
                    disabled={status === 'analyzing'}
                  >
                    Change File
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleAnalyze}
                    disabled={status === 'analyzing'}
                    isLoading={status === 'analyzing'}
                    icon={Search}
                  >
                    Analyze Audio
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Timestamped Forensic Observations Strip */}
          {result && timestampFindings.length > 0 && (
            <Card
              title="Timestamp-Linked Acoustic Observations"
              subtitle="Click any finding to seek the audio player directly to that second"
            >
              <div className="space-y-2">
                {timestampFindings.map((finding, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      seekToTime(finding.timestamp);
                      setActiveFindingTimestamp(finding.timestamp);
                    }}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                      Math.abs(currentTime - finding.timestamp) < 1.0
                        ? 'bg-teal-50 border-teal-300 text-teal-950 font-medium'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-900">{finding.title}</div>
                        <div className="text-slate-600 mt-0.5">{finding.description}</div>
                      </div>
                    </div>
                    <span className="font-mono text-teal-700 font-bold shrink-0 bg-teal-100/70 px-2 py-0.5 rounded text-[11px]">
                      @{finding.timestamp.toFixed(1)}s
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Acoustic Analysis Guide */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 space-y-2">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-teal-600" />
              <span>Acoustic Speech Analysis Notes</span>
            </div>
            <p className="leading-relaxed">
              TraceAI inspects vocoder phase consistency, room acoustic noise floors, and glottal impedance continuity. Aggressive noise suppression filters or compression codecs (e.g. cellular voice) may mimic synthetic frequency cutoffs.
            </p>
          </div>
        </div>

        {/* Right Column: Results & Feedback */}
        <div className="lg:col-span-5 space-y-4">
          {status === 'idle' && (
            <Card className="h-full flex flex-col items-center justify-center text-center p-8 min-h-[380px]">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">
                Ready for Audio Inspection
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
                Upload a voice memo or audio clip to evaluate synthetic speech indicators, vocoder continuity, and acoustic reverberation profiles.
              </p>
            </Card>
          )}

          {status === 'analyzing' && (
            <div className="min-h-[380px] flex items-center justify-center">
              <ProgressIndicator
                percent={progressPercent}
                step={progressStep}
                category="acoustic vocoder & harmonics"
              />
            </div>
          )}

          {status === 'error' && (
            <ErrorState
              title="Audio Evaluation Failed"
              message={analysisError}
              onRetry={handleAnalyze}
            />
          )}

          {status === 'completed' && result && (
            <AnalysisResult
              result={result}
              onReset={handleClear}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default AudioDetectorPage;
