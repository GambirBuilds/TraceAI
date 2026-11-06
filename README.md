# TraceAI — AI Content Intelligence

**Beyond AI Detection. Into Digital Trust.**

TraceAI is a multimodal content intelligence platform designed to investigate the authenticity, characteristics, and potential manipulation of digital content. It provides analysis capabilities for text, images, audio, and video through a unified interface.

The platform combines AI detection integrations, linguistic analysis, media metadata inspection, provenance exploration, and structured forensic reporting to help users make more informed assessments about digital content.

---

## Overview

Digital content is increasingly created, modified, and distributed using artificial intelligence. Determining its origin and authenticity can be challenging.

TraceAI aims to make digital content investigation more accessible by bringing multiple analysis capabilities into one platform.

**Core objectives:**
- Analyze text for AI-associated linguistic patterns.
- Investigate images for metadata and authenticity indicators.
- Examine audio for potential synthetic speech characteristics.
- Inspect videos for potential manipulation indicators.
- Present structured findings, confidence information, and limitations.
- Maintain analysis history and generate investigation reports.

## Key Features

### 1. Text Intelligence
- AI-associated writing pattern analysis.
- Sentence-level observations and highlighting.
- Writing consistency and sentence variation analysis.
- AI-like, human-like, and uncertain writing distribution.
- Linguistic findings with explanations.
- Model and provider information where available.

### 2. Image Intelligence
- Image metadata inspection.
- EXIF information analysis.
- Content Credentials and C2PA provenance exploration.
- Visual authenticity investigation.
- Image comparison interface.

### 3. Audio Intelligence
- Audio file analysis interface.
- Waveform and timeline visualization.
- Potential synthetic speech indicators.
- Timestamped investigation findings.

### 4. Video Intelligence
- Video playback and timeline navigation.
- Keyframe gallery.
- Timestamped forensic observations.
- Video metadata and manipulation investigation.

### 5. Analytics Dashboard
- Analysis overview and activity statistics.
- Content category distribution.
- Analysis history.
- Performance and provider status information.

### 6. Reports and History
- Analysis history and filtering.
- Structured investigation reports.
- CSV and JSON export capabilities.
- Report viewing and printing.

### 7. User and Administration
- Authentication and account management.
- User settings and preferences.
- Role-based administrative interfaces.
- Notifications and audit log functionality.
- Evaluation and model quality monitoring interfaces.

### 8. Modern User Experience
- Responsive desktop and mobile layouts.
- Light and dark themes.
- Reusable interface components.
- Interactive charts and visualizations.
- Loading, empty, and error states.

---

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React 19, JavaScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Database Layer | Prisma ORM, PostgreSQL |
| Validation | Zod |
| Authentication | JWT, bcryptjs |
| Security | Helmet, CORS |
| File Uploads | Multer |
| Containerization | Docker, Docker Compose |
| AI Integration | Google GenAI package and configurable detection providers |

---

## Project Architecture

```text
TraceAI/
│
├── src/
│   ├── app/
│   ├── components/
│   │   ├── analysis/
│   │   ├── charts/
│   │   ├── common/
│   │   └── layout/
│   ├── context/
│   ├── features/
│   │   ├── landing/
│   │   ├── dashboard/
│   │   ├── text-detection/
│   │   ├── image-detection/
│   │   ├── audio-detection/
│   │   ├── video-detection/
│   │   ├── history/
│   │   ├── reports/
│   │   ├── settings/
│   │   ├── admin/
│   │   └── evaluation/
│   ├── hooks/
│   ├── services/
│   └── utils/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── jobs/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   ├── tests/
│   └── package.json
│
├── server.ts
├── vite.config.ts
├── package.json
├── docker-compose.yml
├── .env.example
├── vercel.json
└── README.md
```

---

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js 20 or later
- npm
- PostgreSQL (for database-backed functionality)
- Git

Docker is optional for running the supporting services.

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/TraceAI.git
```

### 2. Navigate into the project

```bash
cd TraceAI
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a reference.

For backend configuration, also prepare the variables documented in `backend/.env.example` and ensure the backend environment loader can access them.

Configure your own database credentials and provider API keys. Never commit real credentials to GitHub.

### 5. Start the development server

```bash
npm run dev
```

Open the application:

```text
http://localhost:3000
```

The Express server mounts the Vite development middleware and exposes the API under:

```text
http://localhost:3000/api/v1
```

---

## Available Commands

| Command | Description |
|---|---|
| `npm install` | Install root dependencies |
| `npm run dev` | Start the full-stack development server |
| `npm run build` | Build frontend production assets |
| `npm run preview` | Preview the production frontend build |
| `npm run lint` | Run TypeScript checks |
| `npm run start` | Start the application server |

### Backend testing

```bash
node --test backend/tests/unit/fileUtils.test.js backend/tests/integration/api.test.js
```

### Backend standalone scripts

From the backend directory:

```bash
cd backend
npm install
npm run dev
```

---

## API Overview

The backend exposes versioned REST API routes under `/api/v1`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register an account |
| POST | `/auth/login` | Authenticate a user |
| GET | `/auth/me` | Retrieve the current user |
| POST | `/analyze/text` | Analyze text content |
| POST | `/analyze/image` | Analyze image content |
| POST | `/analyze/audio` | Analyze audio content |
| POST | `/analyze/video` | Analyze video content |
| GET | `/analyses` | Retrieve analysis history |
| GET | `/analyses/:id` | Retrieve an analysis |
| GET | `/reports` | Retrieve reports |
| GET | `/analytics/overview` | Retrieve analytics |
| GET | `/notifications` | Retrieve notifications |
| GET | `/health` | Check service health |

All endpoints are relative to `/api/v1`.

---

## Responsible AI and Analysis Limitations

TraceAI is designed as an investigative assistance platform, not an absolute authorship verification system.

Important principles:

- AI detection scores are estimates, not proof of authorship.
- Human-written content may be incorrectly flagged.
- AI-generated content may be edited to appear more natural.
- Missing metadata does not prove manipulation.
- C2PA credentials can provide provenance information but do not establish the truth of every claim in a file.
- Results depend on the availability, quality, and limitations of the configured analysis providers.
- Inconclusive or unavailable results should be presented honestly.

Analysis results should not be used as the sole basis for academic, professional, legal, or disciplinary decisions.

---

## Security Considerations

TraceAI includes security-related components such as:

- Password hashing.
- JWT-based authentication.
- HTTP security headers.
- API rate limiting.
- Request and upload validation.
- Environment-based configuration.
- Role-based administration interfaces.

Before production deployment, configure secure secrets, database access controls, private file storage, HTTPS, appropriate CORS policies, and production logging.

Never publish `.env` files, passwords, tokens, or private API credentials.

---

## Deployment

The project includes a Vercel configuration for frontend deployment.

The full-stack application also uses an Express server, so production deployment must account for the backend runtime and its database, storage, and provider dependencies.

Recommended deployment separation:

| Component | Deployment Option |
|---|---|
| Frontend | Vercel |
| Backend API | Node.js hosting |
| Database | Managed PostgreSQL |
| File storage | Private S3-compatible storage |
| Background processing | Separate worker service |
| Cache and queues | Redis |

Verify all environment variables, API integrations, database migrations, and production build settings before deployment.

---

## Project Status

**Development Stage:** Active Development

TraceAI is being developed in stages, with ongoing work focused on frontend functionality, backend integration, multimodal analysis, security, testing, and production readiness.

Not every listed capability necessarily has a fully configured external provider or production deployment. Refer to the actual implementation and provider status when evaluating individual features.

---

## Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the implementation.
5. Submit a pull request with a clear description.

Please follow the existing project structure and coding conventions.

---

## License

This project is distributed under the license specified in the repository's `LICENSE` file.

---

**TraceAI — Beyond AI Detection. Into Digital Trust.**
