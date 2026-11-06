# TraceAI — AI Content Intelligence
## Multimodal Forensic Intelligence, Real Backend & Production SaaS Architecture (Parts 1, 2 & 3)

TraceAI is a professional, production-oriented multimodal content analysis platform designed to help analysts, journalists, educators, and enterprise security teams investigate the possible origins, authenticity indicators, and manipulation patterns of digital media:

1. **Text Content Analysis & Stylometry**: Sentence-level interactive highlighting, burstiness variance, writing consistency across paragraphs, formulaic rhetorical transition detection, and language identification.
2. **Image Authenticity & Forensics**: EXIF metadata extraction, C2PA Content Credentials cryptographic inspection, visual forensics, and side-by-side dual-image comparison.
3. **Audio & Synthetic Speech**: Interactive audio waveform scrubber, timeline seeking, acoustic resonance, vocoder phase continuity, and clickable timestamped findings.
4. **Video Manipulation Analysis**: Synchronized 3-pane layout (Video Player + Timeline, Forensic Findings, and Extracted Keyframe Gallery with seek-to-frame controls).

---

## 1. Enterprise SaaS Infrastructure & Part 3 Capabilities

- **Advanced Analytics Center**: Real database-backed statistics (no fabricated demo data) with date range filtering (`Today`, `Last 7d`, `Last 30d`, `Last 90d`), category distribution, latency performance, and provider health status.
- **Database Notification Center**: Real-time persistent notifications with unread counter badges, dismissals, and mark-as-read mutations.
- **Administrative Console (`/app/admin`)**: Role-Based Access Control (`admin`, `senior_analyst`, `user`), subscription tiers (`enterprise`, `pro`, `free`), immutable security audit trails, and background worker queue monitoring.
- **Model Evaluation & Quality Benchmarks (`/app/evaluation`)**: Empirical benchmarks on academic reference datasets (RAID, DeepfakeTIMIT, SynthText, LibriSpeech-TTS) reporting False Positive Rates (FPR), False Negative Rates (FNR), Precision, Recall, and Expected Calibration Error (ECE), alongside crucial non-native (ESL) speaker false-positive advisories.
- **Advanced Export & Reporting**: Printable executive audit dossiers (PDF/Print), structured tabular CSV exports, and raw JSON machine-readable audits.
- **History Archive & Full-Text Search**: Server-side and client-side querying, category/status filters, bulk selection checkboxes, and bulk deletion workflows.
- **Dual-Theme Support**: Built on a modern, trustworthy light theme baseline (`#F8FAFC`, `#172033`, `#2563EB`) with zero-pill metadata discipline and full dark mode support via Tailwind CSS v4 `@custom-variant dark`.
- **Legal & Compliance Suite**: Production-grade Privacy Policy (`/privacy`), Terms of Service (`/terms`), and Enterprise Data Governance (`/data-governance`).
- **Global Error Boundary & 404 Resilience**: Graceful crash containment and custom not-found routing.

---

## 2. API Endpoints

### Authentication & Account Governance
- `POST /api/v1/auth/register` — Register a new analyst account
- `POST /api/v1/auth/login` — Login and receive JWT access token
- `POST /api/v1/auth/logout` — Revoke session cookies
- `GET /api/v1/auth/me` — Retrieve current authenticated analyst profile
- `PUT /api/v1/auth/profile` — Update analyst profile
- `DELETE /api/v1/auth/account` — Purge analyst account

### Multimodal Analysis Pipelines
- `POST /api/v1/analyze/text` — Submit text for sentence-level stylometric & neural evaluation
- `POST /api/v1/analyze/image` — Multipart upload for EXIF, C2PA, and neural image forensics
- `POST /api/v1/analyze/audio` — Multipart upload for waveform parsing & synthetic speech analysis
- `POST /api/v1/analyze/video` — Multipart upload for video track verification & background job dispatch
- `GET /api/v1/analyses` — Query past analyses with pagination, sorting, and category filters
- `GET /api/v1/analyses/:id` — Retrieve specific analysis dossier
- `DELETE /api/v1/analyses/:id` — Delete analysis record and purge storage file

### Analytics & System Health
- `GET /api/v1/analytics/overview` — Database-backed statistics filtered by date range (`today`, `7d`, `30d`, `90d`)
- `GET /api/v1/analytics/provider-status` — Operational telemetry for AI engines and C2PA parsers
- `GET /api/v1/health` — Service healthcheck and uptime
- `GET /api/v1/providers/status` — Operational status of AI detection providers

### Admin Console & Intelligence Ops (RBAC)
- `GET /api/v1/admin/overview` — System overview counts and storage metrics
- `GET /api/v1/admin/users` — User account directory with roles and subscription tiers
- `PUT /api/v1/admin/users/:userId/role` — Update user permissions and quotas
- `GET /api/v1/admin/audit-logs` — Immutable audit trail of operational events
- `GET /api/v1/admin/jobs` — Background job worker status
- `GET /api/v1/admin/evaluations` — Empirical model benchmark dataset metrics

### Database Notifications
- `GET /api/v1/notifications` — Retrieve user notifications
- `GET /api/v1/notifications/unread-count` — Count of unread alerts
- `POST /api/v1/notifications/:id/read` — Mark notification as read
- `POST /api/v1/notifications/mark-all-read` — Mark all alerts as read
- `DELETE /api/v1/notifications/:id` — Delete notification

### Formal Audit Reports
- `GET /api/v1/reports` — List available formal audit reports
- `GET /api/v1/reports/:id` — Retrieve compiled compliance report
- `GET /api/v1/reports/:id/download` — Download exportable JSON audit dossier

---

## 3. Technology Stack

- **Frontend**: React 19, Tailwind CSS v4, Lucide React, Recharts, React Router DOM v7
- **Backend**: Node.js 20+, Express.js 4, JavaScript ES Modules
- **ORM & Database**: Prisma ORM, PostgreSQL 16
- **Validation**: Zod
- **File Ingestion**: Multer (memory streaming buffer with magic byte verification)
- **Security**: bcryptjs, jsonwebtoken, helmet, cors
- **Containerization**: Docker, Docker Compose (PostgreSQL, Redis, MinIO S3, Backend)

---

## 4. Development & Testing Commands

```bash
# 1. Run full-stack dev server (Express backend + Vite frontend on port 3000)
npm run dev

# 2. Run backend automated test suites (unit & integration)
node --test backend/tests/unit/fileUtils.test.js backend/tests/integration/api.test.js

# 3. Check codebase linting
npm run lint

# 4. Build frontend production assets
npm run build
```

---

## 5. Security & Verification Policy

TraceAI never manufactures arbitrary detection scores or simulates artificial success. If an external neural model adapter is unconfigured or unavailable, TraceAI reports an explicit `inconclusive` or `unavailable` assessment alongside detailed forensic boundaries.
