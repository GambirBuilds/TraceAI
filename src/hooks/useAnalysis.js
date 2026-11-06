/**
 * TraceAI useAnalysis Hook
 * Centralizes analysis job lifecycle, progress states, and storage integration.
 */

import { useState, useCallback } from 'react';
import { historyService } from '../services/history/historyService';
import { useNotification } from '../context/NotificationContext';
import { textAnalysisService } from '../services/analysis/textAnalysisService';
import { imageAnalysisService } from '../services/analysis/imageAnalysisService';
import { audioAnalysisService } from '../services/analysis/audioAnalysisService';
import { videoAnalysisService } from '../services/analysis/videoAnalysisService';

export function useAnalysis(contentType) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'analyzing' | 'completed' | 'error'
  const [progressStep, setProgressStep] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { notify } = useNotification();

  const resetAnalysis = useCallback(() => {
    setStatus('idle');
    setProgressStep('');
    setProgressPercent(0);
    setResult(null);
    setError(null);
  }, []);

  const runAnalysis = useCallback(async (input, options = {}) => {
    setStatus('analyzing');
    setError(null);
    setResult(null);
    setProgressPercent(15);
    setProgressStep('Preprocessing payload & validating container integrity...');

    try {
      // Step 2 progress update
      await new Promise(r => setTimeout(r, 300));
      setProgressPercent(45);
      setProgressStep('Extracting structural markers & mathematical embeddings...');

      let evaluationResult;

      switch (contentType) {
        case 'text':
          evaluationResult = await textAnalysisService.analyzeText(input, options);
          break;
        case 'image':
          evaluationResult = await imageAnalysisService.analyzeImage(input, options);
          break;
        case 'audio':
          evaluationResult = await audioAnalysisService.analyzeAudio(input, options);
          break;
        case 'video':
          evaluationResult = await videoAnalysisService.analyzeVideo(input, options);
          break;
        default:
          throw new Error(`Unsupported content type: ${contentType}`);
      }

      await new Promise(r => setTimeout(r, 300));
      setProgressPercent(80);
      setProgressStep('Compiling forensic observations and limitations...');

      await new Promise(r => setTimeout(r, 200));
      setProgressPercent(100);
      setProgressStep('Analysis complete.');

      setResult(evaluationResult);
      setStatus('completed');

      // Auto-save to history repository
      historyService.save(evaluationResult);

      notify({
        title: 'Analysis Completed',
        message: `Evaluation for ${contentType} completed with structured findings.`,
        type: 'success'
      });

      return evaluationResult;
    } catch (err) {
      setStatus('error');
      setError(err.message || 'An unexpected failure occurred during evaluation.');
      notify({
        title: 'Analysis Failed',
        message: err.message || 'Failed to complete analysis.',
        type: 'error'
      });
      return null;
    }
  }, [contentType, notify]);

  return {
    status,
    progressStep,
    progressPercent,
    result,
    error,
    runAnalysis,
    resetAnalysis,
    setResult
  };
}
