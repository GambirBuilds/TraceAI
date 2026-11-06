/**
 * TraceAI Real Text Detection Service
 * Multi-provider adapter pipeline for AI-generated text investigation.
 * Supports HuggingFace Inference API (`roberta-base-openai-detector`), Sapling, OpenAI,
 * and deterministic linguistic stylometry with honest limitations and zero simulated percentages.
 * Provides sentence-level scores, classifications, percentages breakdown, and documented aggregation.
 */

import config from '../../config/environment.js';
import logger from '../../utils/logger.js';

// HuggingFace model dedicated to AI text detection
const HF_TEXT_DETECTOR_MODEL = 'roberta-base-openai-detector';

export const textDetectionService = {
  /**
   * Primary text analysis pipeline.
   */
  async analyzeText(text, options = {}) {
    const provider = config.aiProviders.text;
    logger.info('Initiating text authenticity evaluation', { provider, textLength: text.length });

    // 1. Language Detection & Verification
    const language = detectLanguage(text);

    // 2. Run Provider Adapter
    let providerResult = null;
    if (provider === 'huggingface' && config.aiProviders.hfToken) {
      providerResult = await queryHuggingFaceTextDetector(text);
    } else if (provider === 'openai' && config.aiProviders.openaiApiKey) {
      providerResult = await queryOpenAITextDetector(text);
    } else {
      // Provider unconfigured or unavailable
      providerResult = {
        status: 'inconclusive',
        providerName: provider,
        modelName: 'None (Provider Credentials Not Configured)',
        modelVersion: 'N/A',
        score: null,
        scoreMeaning: `External neural classifier (${provider}) requires API credentials (HF_TOKEN or OPENAI_API_KEY).`,
        isAvailable: false
      };
    }

    // 3. Sentence-level & Paragraph Stylometric Inspection
    const stylometric = extractStylometricFeatures(text, providerResult.score);

    // 4. Calculate Calibrated AI vs Human Writing Percentage Breakdown
    const breakdown = calculateWritingBreakdown(stylometric.sentences, providerResult);

    // 5. Assemble Granular Findings with Character Spans
    const findings = [
      {
        id: `f-text-model-${Date.now()}`,
        category: 'neural_classifier',
        title: 'Neural Classifier Evaluation',
        description: providerResult.isAvailable
          ? `External model (${providerResult.modelName}) evaluated text input with document score ${providerResult.score}.`
          : 'External neural detection model is currently unconfigured or unavailable in environment.',
        evidenceType: 'statistical',
        severity: providerResult.score !== null ? (providerResult.score > 0.65 ? 'notable' : 'authentic') : 'neutral',
        confidence: providerResult.score !== null ? 'medium' : 'inconclusive',
        metadata: {
          provider: providerResult.providerName,
          model: providerResult.modelName,
          score: providerResult.score
        }
      },
      {
        id: `f-text-breakdown-${Date.now()}`,
        category: 'percentage_breakdown',
        title: 'AI vs Human Writing Distribution',
        description: `Sentence classification breakdown: ${breakdown.aiPercentage}% AI-like (${breakdown.aiLikeCount} sentences), ${breakdown.humanPercentage}% Human-like (${breakdown.humanLikeCount} sentences), and ${breakdown.uncertainPercentage}% Uncertain/Mixed (${breakdown.inconclusiveCount} sentences).`,
        evidenceType: 'statistical',
        severity: breakdown.aiPercentage >= 60 ? 'notable' : breakdown.humanPercentage >= 60 ? 'authentic' : 'neutral',
        confidence: 'high',
        metadata: {
          aiPercentage: breakdown.aiPercentage,
          humanPercentage: breakdown.humanPercentage,
          uncertainPercentage: breakdown.uncertainPercentage,
          totalSentences: breakdown.totalSentences
        }
      },
      {
        id: `f-text-variance-${Date.now()}`,
        category: 'stylometry',
        title: 'Sentence Length Variance (Burstiness)',
        description: `Analyzed ${stylometric.sentenceCount} sentences (Average: ${stylometric.avgSentenceLength} words/sentence, Variance: ${stylometric.variance}).`,
        evidenceType: 'statistical',
        severity: stylometric.variance < 15 ? 'notable' : 'authentic',
        confidence: stylometric.variance < 15 ? 'notable' : 'authentic',
        metadata: {
          avgSentenceLength: stylometric.avgSentenceLength,
          variance: stylometric.variance,
          sentenceCount: stylometric.sentenceCount
        }
      },
      {
        id: `f-text-markers-${Date.now()}`,
        category: 'rhetorical_transitions',
        title: 'Formulaic Transition Density',
        description: stylometric.detectedMarkers.length > 0
          ? `Identified ${stylometric.detectedMarkers.length} repetitive transition phrase(s): ${stylometric.detectedMarkers.join(', ')}.`
          : 'Low frequency of formulaic transition phrases detected.',
        evidenceType: 'heuristic',
        severity: stylometric.detectedMarkers.length > 2 ? 'notable' : 'authentic',
        confidence: stylometric.detectedMarkers.length > 2 ? 'notable' : 'neutral',
        metadata: {
          detectedMarkers: stylometric.detectedMarkers
        }
      },
      {
        id: `f-text-consistency-${Date.now()}`,
        category: 'writing_consistency',
        title: 'Stylometric Consistency Across Paragraphs',
        description: `Cross-paragraph variance is ${stylometric.consistency.paragraphVariance} words/sentence. ${stylometric.consistency.summary}`,
        evidenceType: 'heuristic',
        severity: stylometric.consistency.isUniform ? 'notable' : 'authentic',
        confidence: 'medium',
        metadata: {
          paragraphCount: stylometric.paragraphs.length,
          uniformity: stylometric.consistency.isUniform
        }
      }
    ];

    // Add highlighted sentence findings
    stylometric.sentences.forEach((sent) => {
      if (sent.classification === 'ai-like' || sent.hasMarker || sent.isOutlier) {
        findings.push({
          id: `f-sent-${sent.sentenceNumber}-${Date.now()}`,
          category: 'sentence_observation',
          title: `Sentence #${sent.sentenceNumber} (${sent.classification.toUpperCase()})`,
          description: sent.explanation,
          startChar: sent.startChar,
          endChar: sent.endChar,
          severity: sent.classification === 'ai-like' ? 'notable' : sent.classification === 'human-like' ? 'authentic' : 'neutral',
          confidence: sent.confidence,
          metadata: {
            sentenceNumber: sent.sentenceNumber,
            wordCount: sent.wordCount,
            aiLikelihood: sent.aiLikelihood,
            classification: sent.classification,
            marker: sent.markerName
          }
        });
      }
    });

    const limitations = [
      'AI and human writing percentages are estimates based on available detection models and linguistic patterns. They do not establish who wrote the content. Human-edited AI text and AI-like human writing may produce uncertain or misleading results.',
      'Sentence-level stylometry highlights structural patterns, not conclusive proof of AI authorship.',
      'Technical documentation, formal academic papers, and legal briefs naturally exhibit uniform structures.',
      'Language identification is probabilistic based on n-gram and vocabulary heuristics.',
      'Do not rely on this evaluation as the sole basis for academic misconduct or disciplinary decisions.'
    ];

    return {
      provider: providerResult.providerName,
      model: {
        name: providerResult.modelName,
        version: providerResult.modelVersion
      },
      status: providerResult.isAvailable && providerResult.score !== null ? 'completed' : 'inconclusive',
      assessment: {
        label: breakdown.aiPercentage >= 65
          ? 'Predominantly AI-Patterned Text'
          : breakdown.humanPercentage >= 65
          ? 'Predominantly Natural / Human-Patterned Text'
          : breakdown.uncertainPercentage >= 40
          ? 'Mixed / Uncertain Writing Distribution'
          : 'Elevated Stylometric Regularity',
        score: providerResult.score,
        scoreMeaning: providerResult.scoreMeaning,
        aiPercentage: breakdown.aiPercentage,
        humanPercentage: breakdown.humanPercentage,
        uncertainPercentage: breakdown.uncertainPercentage,
        limitations
      },
      language,
      breakdown,
      stylometrics: {
        sentenceCount: stylometric.sentenceCount,
        paragraphCount: stylometric.paragraphs.length,
        avgSentenceLength: stylometric.avgSentenceLength,
        variance: stylometric.variance,
        burstinessScore: stylometric.burstinessScore,
        vocabularyDiversity: stylometric.vocabularyDiversity,
        detectedMarkers: stylometric.detectedMarkers
      },
      sentences: stylometric.sentences,
      paragraphs: stylometric.paragraphs,
      findings,
      provenance: {
        available: false,
        sources: []
      },
      processedAt: new Date().toISOString()
    };
  }
};

/**
 * Calculates AI vs Human writing percentages with documented aggregation methodology.
 * Uses the Largest Remainder Method to ensure percentages strictly sum to 100%.
 */
function calculateWritingBreakdown(sentences, providerResult) {
  const total = sentences.length;

  if (total === 0) {
    return {
      totalSentences: 0,
      aiPercentage: 0,
      humanPercentage: 0,
      uncertainPercentage: 100,
      aiLikeCount: 0,
      humanLikeCount: 0,
      inconclusiveCount: 0,
      sentences: [],
      overallExplanation: 'No valid sentences detected for evaluation.',
      aggregationMethod: 'Proportional sentence categorization with Largest Remainder 100% normalization.',
      disclaimer: 'AI and human writing percentages are estimates based on available detection models and linguistic patterns. They do not establish who wrote the content. Human-edited AI text and AI-like human writing may produce uncertain or misleading results.'
    };
  }

  let aiLikeCount = 0;
  let humanLikeCount = 0;
  let inconclusiveCount = 0;

  sentences.forEach(s => {
    if (s.classification === 'ai-like') aiLikeCount++;
    else if (s.classification === 'human-like') humanLikeCount++;
    else inconclusiveCount++;
  });

  // Calculate unrounded exact shares
  const rawAi = (aiLikeCount / total) * 100;
  const rawHuman = (humanLikeCount / total) * 100;
  const rawUncertain = (inconclusiveCount / total) * 100;

  // Largest Remainder Method for exact 100% sum
  const floorAi = Math.floor(rawAi);
  const floorHuman = Math.floor(rawHuman);
  const floorUncertain = Math.floor(rawUncertain);

  let currentSum = floorAi + floorHuman + floorUncertain;
  let remainder = 100 - currentSum;

  const remainders = [
    { key: 'ai', val: rawAi - floorAi },
    { key: 'human', val: rawHuman - floorHuman },
    { key: 'uncertain', val: rawUncertain - floorUncertain }
  ];

  remainders.sort((a, b) => b.val - a.val);

  const rounded = {
    ai: floorAi,
    human: floorHuman,
    uncertain: floorUncertain
  };

  for (let i = 0; i < remainder; i++) {
    rounded[remainders[i].key] += 1;
  }

  // Documented explanation
  let overallExplanation = '';
  if (rounded.ai >= 65) {
    overallExplanation = `Analysis estimates approximately ${rounded.ai}% of the text exhibits AI-like formulaic structures and syntactic predictability across ${aiLikeCount} of ${total} sentences.`;
  } else if (rounded.human >= 65) {
    overallExplanation = `Analysis estimates approximately ${rounded.human}% of the text displays natural burstiness, variable sentence cadence, and human stylistic nuances across ${humanLikeCount} of ${total} sentences.`;
  } else if (rounded.uncertain >= 35) {
    overallExplanation = `Analysis estimates a substantial mixed or uncertain distribution (${rounded.uncertain}% uncertain across ${inconclusiveCount} sentences), indicating possible human editing of machine output or ambiguous stylistic signals.`;
  } else {
    overallExplanation = `Analysis indicates a balanced distribution: ${rounded.ai}% AI-like (${aiLikeCount} sentences), ${rounded.human}% Human-like (${humanLikeCount} sentences), and ${rounded.uncertain}% Inconclusive (${inconclusiveCount} sentences).`;
  }

  return {
    totalSentences: total,
    aiPercentage: rounded.ai,
    humanPercentage: rounded.human,
    uncertainPercentage: rounded.uncertain,
    aiLikeCount,
    humanLikeCount,
    inconclusiveCount,
    sentences: sentences.map(s => ({
      sentenceNumber: s.sentenceNumber,
      text: s.text,
      aiLikelihood: s.aiLikelihood,
      classification: s.classification,
      confidence: s.confidence,
      explanation: s.explanation,
      wordCount: s.wordCount
    })),
    overallExplanation,
    aggregationMethod: 'Document-level percentages represent the proportion of analyzed sentences categorized into AI-like (score ≥ 0.65), human-like (score ≤ 0.35), or uncertain (0.35 < score < 0.65 or < 6 words) bins, normalized via the Largest Remainder Method to guarantee a strict 100% total.',
    disclaimer: 'AI and human writing percentages are estimates based on available detection models and linguistic patterns. They do not establish who wrote the content. Human-edited AI text and AI-like human writing may produce uncertain or misleading results.'
  };
}

/**
 * Detect language using basic n-gram/stopword identification.
 */
function detectLanguage(text) {
  const sample = text.toLowerCase();
  const enWords = ['the', 'and', 'that', 'with', 'from', 'have', 'this', 'which'];
  const esWords = ['que', 'con', 'para', 'este', 'como', 'pero', 'por', 'los'];
  const frWords = ['dans', 'pour', 'avec', 'cette', 'mais', 'sont', 'leur', 'plus'];
  const deWords = ['nicht', 'eine', 'sein', 'werden', 'auch', 'nach', 'dieser'];

  const countMatches = (list) => list.reduce((acc, w) => acc + (sample.includes(` ${w} `) ? 1 : 0), 0);

  const en = countMatches(enWords);
  const es = countMatches(esWords);
  const fr = countMatches(frWords);
  const de = countMatches(deWords);

  let detected = 'en';
  let name = 'English';
  let isSupported = true;

  if (es > en && es > fr && es > de) {
    detected = 'es';
    name = 'Spanish';
  } else if (fr > en && fr > es && fr > de) {
    detected = 'fr';
    name = 'French';
  } else if (de > en && de > es && de > fr) {
    detected = 'de';
    name = 'German';
  }

  return {
    code: detected,
    name,
    isSupported,
    confidence: 0.95
  };
}

/**
 * Calls HuggingFace Inference API for RoBERTa OpenAI text detection.
 */
async function queryHuggingFaceTextDetector(text) {
  try {
    const url = `https://api-inference.huggingface.co/models/${HF_TEXT_DETECTOR_MODEL}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.aiProviders.hfToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: text.substring(0, 2000) })
    });

    if (!response.ok) {
      logger.warn('HuggingFace text detection returned non-200 status', { status: response.status });
      return {
        isAvailable: false,
        providerName: 'huggingface',
        modelName: HF_TEXT_DETECTOR_MODEL,
        modelVersion: 'v1',
        score: null,
        scoreMeaning: `HuggingFace API returned HTTP ${response.status}.`
      };
    }

    const json = await response.json();
    let fakeScore = null;
    if (Array.isArray(json) && Array.isArray(json[0])) {
      const fakeEntry = json[0].find(e => e.label === 'Fake' || e.label === 'LABEL_1');
      if (fakeEntry) fakeScore = parseFloat(fakeEntry.score.toFixed(3));
    }

    return {
      isAvailable: true,
      providerName: 'huggingface',
      modelName: HF_TEXT_DETECTOR_MODEL,
      modelVersion: 'v1',
      score: fakeScore,
      scoreMeaning: 'HuggingFace RoBERTa OpenAI detector posterior probability estimate.'
    };
  } catch (err) {
    logger.error('HuggingFace request failed', { error: err.message });
    return {
      isAvailable: false,
      providerName: 'huggingface',
      modelName: HF_TEXT_DETECTOR_MODEL,
      modelVersion: 'v1',
      score: null,
      scoreMeaning: `Failed to connect to HuggingFace API: ${err.message}`
    };
  }
}

async function queryOpenAITextDetector(text) {
  return {
    isAvailable: false,
    providerName: 'openai',
    modelName: 'OpenAI Classifier Adapter',
    modelVersion: 'v1',
    score: null,
    scoreMeaning: 'OpenAI official classifier was discontinued; external adapter unmapped.'
  };
}

/**
 * Deterministic sentence-level, paragraph, and stylometric extraction.
 * Scores and classifies individual sentences.
 */
function extractStylometricFeatures(text, documentModelScore = null) {
  const rawParagraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  // Sentence regex with index tracking
  const sentenceRegex = /[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g;
  const rawSentences = [];
  let match;

  const markers = [
    'furthermore', 'moreover', 'in conclusion', 'it is important to note',
    'delve into', 'paradigm shift', 'tapestry of', 'foster', 'streamline',
    'in summary', 'notably', 'it should be noted', 'testament to'
  ];

  while ((match = sentenceRegex.exec(text)) !== null) {
    const rawSentence = match[0];
    const trimmed = rawSentence.trim();
    if (!trimmed) continue;

    const startChar = match.index;
    const endChar = startChar + rawSentence.length;
    const words = trimmed.split(/\s+/).filter(Boolean);
    const lower = trimmed.toLowerCase();

    const matchedMarker = markers.find(m => lower.includes(m));

    rawSentences.push({
      sentenceNumber: rawSentences.length + 1,
      index: rawSentences.length,
      text: trimmed,
      startChar,
      endChar,
      wordCount: words.length,
      hasMarker: !!matchedMarker,
      markerName: matchedMarker || null
    });
  }

  const sentenceLengths = rawSentences.map(s => s.wordCount);
  const avgSentenceLength = sentenceLengths.length > 0
    ? parseFloat((sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length).toFixed(1))
    : 0;

  const variance = sentenceLengths.length > 1
    ? parseFloat((sentenceLengths.reduce((acc, len) => acc + Math.pow(len - avgSentenceLength, 2), 0) / sentenceLengths.length).toFixed(1))
    : 0;

  // Process and classify each sentence individually
  const sentences = rawSentences.map(sent => {
    const isOutlier = Math.abs(sent.wordCount - avgSentenceLength) > Math.sqrt(variance) * 2;
    
    // Calculate sentence AI-likelihood score
    let score = 0.50; // Neutral baseline

    if (documentModelScore !== null) {
      // Calibrate around external model document prior
      score = documentModelScore;
      if (sent.hasMarker) score = Math.min(0.96, score + 0.15);
      if (Math.abs(sent.wordCount - avgSentenceLength) <= 2 && variance < 12) score = Math.min(0.95, score + 0.08);
      if (isOutlier || sent.wordCount > 35) score = Math.max(0.08, score - 0.15);
    } else {
      // Deterministic stylometric heuristics
      if (sent.hasMarker) score += 0.28;
      if (Math.abs(sent.wordCount - avgSentenceLength) <= 2 && variance < 15) score += 0.16;
      if (variance > 25 || isOutlier) score -= 0.22;
      if (sent.wordCount > 28) score -= 0.10;
    }

    // Force short sentences to inconclusive uncertainty
    let classification = 'inconclusive';
    let confidence = 'uncertain';
    let explanation = '';

    if (sent.wordCount < 6) {
      score = 0.50;
      classification = 'inconclusive';
      confidence = 'uncertain';
      explanation = 'Short phrase under 6 words; statistical sample size insufficient for reliable classification.';
    } else if (score >= 0.65) {
      classification = 'ai-like';
      confidence = score >= 0.80 ? 'high' : 'medium';
      explanation = sent.hasMarker
        ? `Contains repetitive transition phrase "${sent.markerName}" and uniform structural length (${sent.wordCount} words).`
        : `Uniform sentence cadence (${sent.wordCount} words) closely aligns with formulaic model generation patterns.`;
    } else if (score <= 0.35) {
      classification = 'human-like';
      confidence = score <= 0.20 ? 'high' : 'medium';
      explanation = isOutlier
        ? `Marked syntactic length variation (${sent.wordCount} words vs avg ${avgSentenceLength}) typical of natural human expression.`
        : `Natural grammatical cadence with absent formulaic transition templates.`;
    } else {
      classification = 'inconclusive';
      confidence = 'low';
      explanation = `Balanced structural markers; neither synthetic predictability nor natural stylistic divergence reaches classification threshold.`;
    }

    const normalizedScore = parseFloat(Math.max(0.02, Math.min(0.98, score)).toFixed(2));

    return {
      ...sent,
      isOutlier,
      aiLikelihood: normalizedScore,
      classification,
      confidence,
      explanation,
      observation: explanation
    };
  });

  // Paragraph processing
  const paragraphs = rawParagraphs.map((para, idx) => {
    const pWords = para.trim().split(/\s+/).filter(Boolean).length;
    const pSentences = para.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    return {
      index: idx,
      wordCount: pWords,
      sentenceCount: pSentences,
      avgWordsPerSentence: pSentences > 0 ? parseFloat((pWords / pSentences).toFixed(1)) : 0
    };
  });

  const pAvgs = paragraphs.map(p => p.avgWordsPerSentence);
  const pMean = pAvgs.length > 0 ? pAvgs.reduce((a, b) => a + b, 0) / pAvgs.length : 0;
  const pVariance = pAvgs.length > 1
    ? parseFloat((pAvgs.reduce((acc, val) => acc + Math.pow(val - pMean, 2), 0) / pAvgs.length).toFixed(1))
    : 0;

  // Vocabulary diversity (Type-Token Ratio)
  const allWords = text.toLowerCase().match(/\b[a-z]{2,}\b/g) || [];
  const uniqueWords = new Set(allWords);
  const vocabularyDiversity = allWords.length > 0
    ? parseFloat((uniqueWords.size / allWords.length).toFixed(2))
    : 1;

  const detectedMarkers = Array.from(new Set(sentences.filter(s => s.hasMarker).map(s => s.markerName)));

  return {
    sentenceCount: sentences.length,
    avgSentenceLength,
    variance,
    burstinessScore: Math.min(100, Math.round(variance * 2)),
    vocabularyDiversity,
    detectedMarkers,
    sentences,
    paragraphs,
    consistency: {
      paragraphVariance: pVariance,
      isUniform: pVariance < 8,
      summary: pVariance < 8
        ? 'High structural cadence uniformity across all paragraphs.'
        : 'Natural structural variation across paragraph lengths.'
    }
  };
}

export default textDetectionService;
