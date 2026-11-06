/**
 * TraceAI Landing Page
 * Marketing homepage communicating multimodal content authenticity intelligence.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  FileText,
  Image,
  Mic,
  Video,
  ArrowRight,
  Lock,
  Cpu,
  Layers,
  ChevronDown,
  CheckCircle2,
  FileSearch,
  ExternalLink
} from 'lucide-react';
import { Button } from '../../../components/common/Button';

export function LandingPage() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  const capabilities = [
    {
      id: 'text',
      title: 'Text Content Analysis',
      icon: FileText,
      description: 'Investigates stylometric distributions, perplexity variance, and rhetorical transition markers across articles, student submissions, and documentation.',
      path: '/app/text',
      features: ['Stylometric feature extraction', 'Perplexity & burstiness profiling', 'Linguistic uniformity indicators']
    },
    {
      id: 'image',
      title: 'Image Authenticity & Forensics',
      icon: Image,
      description: 'Scans image containers, EXIF metadata, discrete cosine transform (DCT) frequency distributions, and cryptographic C2PA content credentials.',
      path: '/app/image',
      features: ['EXIF & container inspection', 'Diffusion artifact frequency analysis', 'Cryptographic C2PA validation']
    },
    {
      id: 'audio',
      title: 'Audio & Synthetic Speech',
      icon: Mic,
      description: 'Evaluates vocal tract acoustic impedance, glottal pulse continuity, and neural vocoder phase anomalies in speech recordings.',
      path: '/app/audio',
      features: ['Neural vocoder phase inspection', 'Acoustic background noise floor', 'Speech prosody & cadence verification']
    },
    {
      id: 'video',
      title: 'Video Manipulation Analysis',
      icon: Video,
      description: 'Inspects temporal frame consistency, facial boundary optical flow, audio-video sync alignment, and container compression artifacts.',
      path: '/app/video',
      features: ['Frame-by-frame temporal continuity', 'Facial boundary optical flow', 'Phoneme-viseme lip synchrony']
    }
  ];

  const faqs = [
    {
      q: 'Does TraceAI promise 100% accurate AI detection?',
      a: 'No. Responsible AI science acknowledges that statistical patterns do not equal proof of authorship. TraceAI provides multi-layer structural observations, compression analysis, and provenance checks to help analysts investigate origins rather than issuing definitive binary verdicts.'
    },
    {
      q: 'Does the absence of EXIF metadata prove an image is AI generated?',
      a: 'Never. Social media platforms, messaging apps, and web optimizers routinely strip EXIF metadata to protect user privacy or minimize bandwidth. TraceAI explicitly notes that missing metadata is an unsigned state, not evidence of synthetic origin.'
    },
    {
      q: 'Is my uploaded content used to train public AI models?',
      a: 'Absolutely not. TraceAI enforces strict enterprise data boundaries. Uploaded texts, images, audio, and video are evaluated ephemerally in secure sandboxes and never utilized for model fine-tuning or retention.'
    },
    {
      q: 'What is the difference between Part 1 and Part 2 of TraceAI?',
      a: 'Part 1 establishes the production frontend architecture, user experience, client-side format and container validation, and integration contracts. Part 2 integrates the distributed deep neural detection microservices and specialized model weights.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single Text Element) */}
          <Link to="/" className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs shadow-xs">
              <Shield className="w-4 h-4" />
            </span>
            <span>Trace<span className="text-blue-600">AI</span></span>
          </Link>

          {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#capabilities" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">Capabilities</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">Methodology</a>
            <a href="#privacy" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">Data Privacy</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">FAQ</a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              size="sm"
              onClick={() => navigate('/app')}
              icon={ArrowRight}
              iconPosition="right"
            >
              Start Analyzing
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Unboxed Kicker */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-4">
              <span>Multimodal Forensic Intelligence</span>
              <span aria-hidden="true">·</span>
              <span>Lightweight Client Architecture</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight text-balance">
              Understand What's Behind Your Content.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed text-balance">
              Investigate the possible origins, authenticity indicators, and manipulation patterns of digital media. TraceAI delivers transparent, calibrated forensic intelligence across text, images, audio, and video.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={() => navigate('/app')}
                icon={ArrowRight}
                iconPosition="right"
                className="w-full sm:w-auto"
              >
                Launch Analysis Workspace
              </Button>
              <a href="#capabilities" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Explore Features
                </Button>
              </a>
            </div>

            {/* Unboxed Claim-to-Proof Adjacency */}
            <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900">4 Categories</div>
                <div className="text-xs text-slate-500 mt-0.5">Text, Image, Audio, Video</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900">C2PA Ready</div>
                <div className="text-xs text-slate-500 mt-0.5">Cryptographic Provenance</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900">Zero Retention</div>
                <div className="text-xs text-slate-500 mt-0.5">Client-Validated Privacy</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900">Calibrated</div>
                <div className="text-xs text-slate-500 mt-0.5">Inconclusive-Aware Output</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Multimodal Detection Capabilities
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Every content category requires dedicated inspection techniques. TraceAI avoids one-size-fits-all scoring by analyzing domain-specific physical and mathematical anomalies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {cap.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {cap.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                      {cap.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(cap.path)}
                      icon={ArrowRight}
                      iconPosition="right"
                      className="w-full"
                    >
                      Open {cap.title.split(' ')[0]} Detector
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Rigorous Forensic Methodology
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              TraceAI approaches digital media inspection through structured computational verification rather than arbitrary black-box confidence scores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-start p-6 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-8 h-8 rounded-md bg-white border border-slate-200 font-mono font-bold text-blue-600 flex items-center justify-center text-sm mb-4 shadow-2xs">
                01
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Container & Metadata Validation
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Initial ingestion performs safe client-side header parsing, inspecting camera EXIF parameters, audio stream codecs, or text encoding before deep computational processing.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-8 h-8 rounded-md bg-white border border-slate-200 font-mono font-bold text-blue-600 flex items-center justify-center text-sm mb-4 shadow-2xs">
                02
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Mathematical & Frequency Analysis
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Evaluates physical invariants: discrete cosine transforms for image diffusion noise, burstiness variance in text sequences, and glottal continuity in vocal audio.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-8 h-8 rounded-md bg-white border border-slate-200 font-mono font-bold text-blue-600 flex items-center justify-center text-sm mb-4 shadow-2xs">
                03
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Calibrated Findings & Limitations
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Every result is accompanied by explicit technical limitations, known compression pitfalls, and clear guidance on why patterns alone do not prove authorship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy and Security Section */}
      <section id="privacy" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-xs">
            <div className="max-w-3xl">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Enterprise Privacy & Safeguards by Design
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                We believe that inspecting content authenticity must never come at the expense of your proprietary data security. TraceAI enforces strict boundaries:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <h4 className="text-xs font-semibold text-slate-900">Client-Side File Validation</h4>
                  <p className="text-xs text-slate-600 mt-1">Files are validated for type and safety constraints before any remote transmission occurs.</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <h4 className="text-xs font-semibold text-slate-900">No Model Training</h4>
                  <p className="text-xs text-slate-600 mt-1">Your documents, voice samples, and imagery are strictly excluded from AI training datasets.</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <h4 className="text-xs font-semibold text-slate-900">Configurable Data Retention</h4>
                  <p className="text-xs text-slate-600 mt-1">Control your audit history with automatic 7-day or 30-day purge rules, or delete records immediately.</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <h4 className="text-xs font-semibold text-slate-900">C2PA Manifest Integrity</h4>
                  <p className="text-xs text-slate-600 mt-1">Preserves and verifies Coalition for Content Provenance and Authenticity cryptographic hashes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Clear, honest answers about content detection capabilities and boundaries.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Shield className="w-4 h-4 text-blue-500" />
            <span>Trace<span className="text-blue-500">AI</span></span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <Link to="/app" className="hover:text-white transition-colors">Workspace</Link>
            <Link to="/app/text" className="hover:text-white transition-colors">Text</Link>
            <Link to="/app/image" className="hover:text-white transition-colors">Image</Link>
            <Link to="/app/audio" className="hover:text-white transition-colors">Audio</Link>
            <Link to="/app/video" className="hover:text-white transition-colors">Video</Link>
            <Link to="/app/settings" className="hover:text-white transition-colors">Settings</Link>
          </div>

          <div className="text-slate-500">
            © {new Date().getFullYear()} TraceAI Intelligence Lab. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
