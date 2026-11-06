/**
 * TraceAI Analysis Repository
 * Manages analyses, child findings, and cryptographic provenance records.
 */

import { memoryDb } from '../config/database.js';

export const analysisRepository = {
  async create({
    id,
    userId = null,
    contentType,
    status = 'completed',
    originalFilename = null,
    mimeType = null,
    fileSize = null,
    inputReference = null,
    assessmentLabel = null,
    assessmentScore = null,
    modelConfidence = null,
    findings = [],
    provenance = null,
    model = null,
    assessment = null,
    breakdown = null,
    sentences = [],
    paragraphs = [],
    stylometrics = null,
    language = null
  }) {
    const analysisId = id || `rec-${contentType.slice(0, 3)}-${Date.now()}`;
    const now = new Date();

    const record = {
      id: analysisId,
      userId,
      contentType,
      status,
      originalFilename,
      mimeType,
      fileSize,
      inputReference,
      assessmentLabel: assessmentLabel || assessment?.label || null,
      assessmentScore: assessmentScore !== null ? assessmentScore : (assessment?.score ?? null),
      modelConfidence,
      assessment: assessment || {
        label: assessmentLabel || 'Completed',
        score: assessmentScore,
        aiPercentage: breakdown?.aiPercentage ?? null,
        humanPercentage: breakdown?.humanPercentage ?? null,
        uncertainPercentage: breakdown?.uncertainPercentage ?? null
      },
      breakdown: breakdown || null,
      sentences: sentences || [],
      paragraphs: paragraphs || [],
      stylometrics: stylometrics || null,
      language: language || null,
      createdAt: now.toISOString(),
      completedAt: now.toISOString(),
      findings: findings || [],
      provenance: provenance || { available: false, sources: [] },
      model: model || { name: 'TraceAI Forensics Engine', version: 'v1.4' }
    };

    memoryDb.analyses.set(analysisId, record);
    return record;
  },

  async findById(id) {
    return memoryDb.analyses.get(id) || null;
  },

  async findMany({ userId = null, contentType = null, status = null, limit = 50, offset = 0 } = {}) {
    let results = Array.from(memoryDb.analyses.values());

    if (userId) {
      results = results.filter(r => r.userId === userId);
    }
    if (contentType && contentType !== 'all') {
      results = results.filter(r => r.contentType === contentType);
    }
    if (status && status !== 'all') {
      results = results.filter(r => r.status === status);
    }

    // Sort newest first
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return results.slice(offset, offset + limit);
  },

  async update(id, updates) {
    const existing = await this.findById(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates
    };
    memoryDb.analyses.set(id, updated);
    return updated;
  },

  async delete(id) {
    return memoryDb.analyses.delete(id);
  }
};

// Seed sample historical records
(() => {
  analysisRepository.create({
    id: 'rec-txt-9821',
    contentType: 'text',
    status: 'completed',
    originalFilename: 'briefing_memo.txt',
    assessmentLabel: 'Structured Linguistic Regularity',
    assessmentScore: null,
    modelConfidence: 'medium',
    findings: [
      {
        id: 'f-1',
        title: 'Transition Phrase Density',
        description: 'Repetitive connective markers detected across 78% of transitions.',
        severity: 'notable'
      },
      {
        id: 'f-2',
        title: 'Perplexity Profile',
        description: 'Low perplexity variance observed across middle sentences.',
        severity: 'moderate'
      }
    ],
    breakdown: {
      totalSentences: 3,
      aiPercentage: 67,
      humanPercentage: 33,
      uncertainPercentage: 0,
      aiLikeCount: 2,
      humanLikeCount: 1,
      inconclusiveCount: 0,
      sentences: [
        {
          sentenceNumber: 1,
          text: 'Furthermore, the integration of automated intelligence frameworks serves as a testament to modern efficiency.',
          aiLikelihood: 0.88,
          classification: 'ai-like',
          confidence: 'high',
          explanation: 'Contains repetitive transition phrase "furthermore" and formulaic structural cadence.',
          wordCount: 16
        },
        {
          sentenceNumber: 2,
          text: 'Moreover, it is important to note that cross-functional synergy fosters long-term organizational stability.',
          aiLikelihood: 0.85,
          classification: 'ai-like',
          confidence: 'high',
          explanation: 'Contains formulaic transition phrase "moreover" with elevated structural uniformity.',
          wordCount: 14
        },
        {
          sentenceNumber: 3,
          text: 'We found surprising resistance during early user testing across regional field offices last Thursday.',
          aiLikelihood: 0.18,
          classification: 'human-like',
          confidence: 'high',
          explanation: 'Natural grammatical cadence with specific contextual detail and no formulaic markers.',
          wordCount: 14
        }
      ],
      overallExplanation: 'Analysis estimates approximately 67% of the text exhibits AI-like formulaic structures across 2 of 3 sentences.',
      aggregationMethod: 'Document-level percentages represent the proportion of analyzed sentences categorized into AI-like (score ≥ 0.65), human-like (score ≤ 0.35), or uncertain (0.35 < score < 0.65 or < 6 words) bins, normalized via the Largest Remainder Method to guarantee a strict 100% total.',
      disclaimer: 'AI and human writing percentages are estimates based on available detection models and linguistic patterns. They do not establish who wrote the content. Human-edited AI text and AI-like human writing may produce uncertain or misleading results.'
    },
    provenance: { available: false, sources: [] },
    model: { name: 'TraceAI Linguistic Stylometry Engine', version: 'v1.4' }
  });

  analysisRepository.create({
    id: 'rec-img-4502',
    contentType: 'image',
    status: 'completed',
    originalFilename: 'smartwatch_concept_v2.png',
    mimeType: 'image/png',
    fileSize: 3450200,
    assessmentLabel: 'Diffusion Frequency Anomalies',
    assessmentScore: null,
    modelConfidence: 'inconclusive',
    findings: [
      {
        id: 'f-img-1',
        title: 'EXIF Metadata Absence',
        description: 'No camera make, lens profile, or exposure parameters found in image headers.',
        severity: 'moderate'
      },
      {
        id: 'f-img-2',
        title: 'C2PA Content Credentials',
        description: 'No cryptographically verifiable provenance manifest embedded in file.',
        severity: 'neutral'
      }
    ],
    provenance: { available: false, sources: [] },
    model: { name: 'TraceAI Visual Forensics Inspector', version: 'v2.1' }
  });
})();

export default analysisRepository;
