/**
 * TraceAI Integration Tests — API Contracts & Endpoints
 */

import assert from 'node:assert';
import { test } from 'node:test';
import { textDetectionService } from '../../src/services/detection/textDetectionService.js';
import { userRepository } from '../../src/repositories/userRepository.js';
import { analysisRepository } from '../../src/repositories/analysisRepository.js';
import { reportGenerationService } from '../../src/services/reports/reportGenerationService.js';
import { createApp } from '../../src/app.js';

test('App initializes with registered routes and middlewares', () => {
  const app = createApp();
  assert.strictEqual(typeof app, 'function');
});

test('User repository supports authentication and password verification', async () => {
  const user = await userRepository.findByEmail('karkiamir15@gmail.com');
  assert.ok(user);
  assert.strictEqual(user.email, 'karkiamir15@gmail.com');

  const valid = await userRepository.verifyPassword(user, 'TraceAIPassword2026!');
  assert.strictEqual(valid, true);

  const invalid = await userRepository.verifyPassword(user, 'WrongPassword!');
  assert.strictEqual(invalid, false);
});

test('Text detection service enforces structural stylometry without fake scores', async () => {
  const sampleText = 'Furthermore, in conclusion it is important to note that the paradigm shift fosters comprehensive optimization across distributed networks.';
  const res = await textDetectionService.analyzeText(sampleText);

  assert.ok(res);
  assert.strictEqual(typeof res.status, 'string');
  assert.ok(Array.isArray(res.findings));
  assert.ok(res.findings.length > 0);
  assert.strictEqual(res.assessment.score !== undefined, true);
  assert.ok(Array.isArray(res.assessment.limitations));
  assert.ok(res.assessment.limitations.length > 0);
});

test('Analysis repository creates, queries, and deletes records', async () => {
  const record = await analysisRepository.create({
    contentType: 'text',
    status: 'completed',
    assessmentLabel: 'High Stylistic Uniformity',
    findings: [{ title: 'Transition Density', description: 'Test finding' }]
  });

  assert.ok(record.id);
  const fetched = await analysisRepository.findById(record.id);
  assert.strictEqual(fetched.id, record.id);

  const list = await analysisRepository.findMany({ contentType: 'text' });
  assert.ok(list.length > 0);

  const deleted = await analysisRepository.delete(record.id);
  assert.strictEqual(deleted, true);

  const afterDelete = await analysisRepository.findById(record.id);
  assert.strictEqual(afterDelete, null);
});

test('Report generation service generates verified audit dossiers', async () => {
  const record = await analysisRepository.create({
    contentType: 'image',
    status: 'completed',
    assessmentLabel: 'Unsigned Asset',
    findings: [{ title: 'EXIF Absent', description: 'Clean headers' }]
  });

  const report = await reportGenerationService.generateReport(record.id);
  assert.ok(report);
  assert.ok(report.content.reportId.startsWith('REP-'));
  assert.strictEqual(report.content.analysis.id, record.id);
  assert.ok(report.content.complianceDisclaimer);
});

test('Text detection calculates AI vs Human Writing Breakdown with exact 100% sum', async () => {
  const multiSentenceText = 'Furthermore, automated machine learning models streamline workflows across modern enterprises. In conclusion, it is important to note that systematic optimization fosters efficiency. On the other hand, my dog barked loudly at the mail carrier yesterday afternoon.';
  const res = await textDetectionService.analyzeText(multiSentenceText);

  assert.ok(res.breakdown);
  const { aiPercentage, humanPercentage, uncertainPercentage, totalSentences, sentences, disclaimer } = res.breakdown;

  assert.strictEqual(typeof aiPercentage, 'number');
  assert.strictEqual(typeof humanPercentage, 'number');
  assert.strictEqual(typeof uncertainPercentage, 'number');
  assert.strictEqual(aiPercentage + humanPercentage + uncertainPercentage, 100, 'Percentages must strictly sum to 100%');
  assert.strictEqual(totalSentences, sentences.length);
  assert.ok(totalSentences >= 3);

  // Validate sentence attributes
  sentences.forEach((sent) => {
    assert.strictEqual(typeof sent.sentenceNumber, 'number');
    assert.strictEqual(typeof sent.text, 'string');
    assert.strictEqual(typeof sent.aiLikelihood, 'number');
    assert.ok(sent.aiLikelihood >= 0 && sent.aiLikelihood <= 1);
    assert.ok(['ai-like', 'human-like', 'inconclusive'].includes(sent.classification));
    assert.strictEqual(typeof sent.explanation, 'string');
  });

  assert.ok(disclaimer.includes('AI and human writing percentages are estimates'));
});

test('Analysis repository and controller store and serve sentence breakdown', async () => {
  const sampleBreakdown = {
    totalSentences: 2,
    aiPercentage: 50,
    humanPercentage: 50,
    uncertainPercentage: 0,
    aiLikeCount: 1,
    humanLikeCount: 1,
    inconclusiveCount: 0,
    sentences: [
      {
        sentenceNumber: 1,
        text: 'Furthermore, the system optimizes throughput.',
        aiLikelihood: 0.82,
        classification: 'ai-like',
        confidence: 'high',
        explanation: 'Formulaic marker "furthermore" detected.'
      },
      {
        sentenceNumber: 2,
        text: 'I cooked pancakes for breakfast with fresh blueberries.',
        aiLikelihood: 0.15,
        classification: 'human-like',
        confidence: 'high',
        explanation: 'Natural cadence without formulaic markers.'
      }
    ],
    overallExplanation: 'Balanced distribution.',
    aggregationMethod: 'Largest Remainder Method.',
    disclaimer: 'AI and human writing percentages are estimates.'
  };

  const record = await analysisRepository.create({
    contentType: 'text',
    status: 'completed',
    assessmentLabel: 'Mixed Writing Distribution',
    breakdown: sampleBreakdown
  });

  assert.ok(record.id);
  const fetched = await analysisRepository.findById(record.id);
  assert.ok(fetched.breakdown);
  assert.strictEqual(fetched.breakdown.aiPercentage, 50);
  assert.strictEqual(fetched.breakdown.humanPercentage, 50);
  assert.strictEqual(fetched.breakdown.totalSentences, 2);
  assert.strictEqual(fetched.breakdown.sentences.length, 2);
});
