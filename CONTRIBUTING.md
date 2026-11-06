# Contributing to TraceAI

Thank you for your interest in contributing to **TraceAI — AI Content Intelligence**.

TraceAI is a production-oriented multimodal content authenticity analysis platform. We welcome contributions that maintain high standards of code hygiene, security, and scientific integrity.

## Core Development Guidelines

1. **Zero Fake Metrics**: We never simulate AI detection percentages or generate fabricated random scores. All findings must stem from actual validated machine learning models or deterministic structural inspection (burstiness, EXIF, C2PA cryptographic signatures).
2. **Honest Limitations**: If an AI detector or external model is unconfigured or unavailable, return an explicit `inconclusive` or `unavailable` assessment rather than guessing.
3. **Frontend Rules**:
   - React functional components with hooks.
   - Clean Light Theme baseline with Tailwind CSS v4.
   - Follow Zero-Pill and Anti-Slop discipline (unboxed metadata with `·` separators; no mechanical `//` comments).
4. **Backend Rules**:
   - Node.js ES Modules with Express.js.
   - All internal relative imports must include `.js` file extensions.
   - Async background timers must invoke `.unref()` to avoid process hanging.

## Pull Request Process

1. Create a feature branch (`git checkout -b feature/my-feature`).
2. Run test suites:
   ```bash
   node --test backend/tests/unit/*.test.js backend/tests/integration/*.test.js
   ```
3. Run linting and build checks:
   ```bash
   npm run lint
   npm run build
   ```
4. Open a pull request with an audit summary of changes.
