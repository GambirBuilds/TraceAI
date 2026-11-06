# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

The TraceAI engineering team takes vulnerabilities seriously. If you discover a security issue or unauthorized data exposure:

1. **Do not create a public issue**.
2. Email security vulnerability disclosures directly to `karkiamir15@gmail.com`.
3. Provide:
   - Type of vulnerability (e.g. CSRF, path traversal, injection, cryptographic flaw).
   - Step-by-step reproduction instructions or proof-of-concept.
   - Potential impact on customer evaluation payloads.
4. We acknowledge receipts within 24 hours and issue security patches promptly.

## Security Practices

- **Zero-Storage of API Keys in Client**: All model integrations pass through secure server proxy routes.
- **Role-Based Access Control (RBAC)**: Route middleware validates JWT signatures and permissions (`admin`, `senior_analyst`, `user`).
- **Cryptographic Provenance**: C2PA manifests are verified against root public certificate stores.
- **Sanitization**: Uploaded filenames and MIME types undergo strict hex signature verification before disk persistence.
