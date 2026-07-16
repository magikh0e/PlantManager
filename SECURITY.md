# Security Policy

Plant Manager is a **local-first, serverless web app**. The entire application
is a single static `index.html` file that runs entirely in your browser. There
is no backend, no user account system, and no server that stores your data — so
the security model is different from a typical web service. This document
explains what that means, what is in scope, and how to report a vulnerability.

## Supported versions

Only the most recent release receives security fixes. Because the app is a
single self-contained file with no server component, the fix for any issue is
simply to deploy/download the latest version.

| Version | Supported |
|---------|-----------|
| 2.10.x (latest) | Yes |
| < 2.10  | No — please update |

The live, always-current build is hosted at
https://tracker.tropicalrootsmaui.com/.

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Report privately using **GitHub's private vulnerability reporting**:

1. Go to the [Security tab](https://github.com/magikh0e/PlantManager/security)
   of the repository.
2. Click **"Report a vulnerability"**.
3. Provide a description, reproduction steps, affected version, and impact.

If you cannot use GitHub's reporting flow, you may contact the maintainer
privately through the repository owner's GitHub profile.

When reporting, please include:

- A clear description of the issue and its security impact
- Steps to reproduce (a minimal proof of concept is ideal)
- The version/commit and browser where you observed it
- Any suggested remediation, if you have one

### What to expect

This is a free, open-source project maintained on a best-effort basis. We aim to:

- **Acknowledge** your report within **7 days**
- **Triage** and confirm the issue within **30 days**
- **Fix and release** valid vulnerabilities as soon as practical, crediting you
  in the changelog unless you prefer to remain anonymous

Please allow reasonable time for a fix before any public disclosure
(coordinated disclosure).

## Security model & scope

Understanding the architecture helps frame what is and isn't a vulnerability:

- **No server.** All data is stored in your browser's `localStorage` under a
  single key. The app does not transmit your data anywhere by default.
- **No accounts.** There is no authentication layer, password store, or session
  management to compromise.
- **Optional integrations only.** Cloud Sync (Firebase), Weather
  (OpenWeatherMap), and Pest ID (Google Cloud Vision) are **opt-in** and only
  active if you supply your own keys/config.

### In scope

We welcome reports about:

- **Cross-site scripting (XSS)** — e.g. user-supplied content (notes, strain
  names, nicknames, journal text) breaking out of escaping and executing script
- **HTML/markup injection** in any field rendered back to the page
- **Data integrity bypass** — defeating the export checksum/envelope so a
  tampered backup imports without warning
- **Service worker / cache poisoning** issues affecting the offline shell
- **Leakage of locally stored secrets** (e.g. an API key being sent to an
  unintended origin)
- **Dependency-free claims** — any hidden remote code execution or unexpected
  network call (the app is intended to make no third-party calls without an
  explicit, user-configured integration)

### Out of scope

The following are known properties of a local-first app and are **not**
considered vulnerabilities:

- **`localStorage` data is not encrypted at rest.** Anyone with access to your
  unlocked device/browser profile can read the app's data. Protect your device.
- **API keys you enter are stored locally in plaintext** in your own browser, by
  design, so the app can use them offline. Treat shared/public computers
  accordingly.
- **No rate limiting / server hardening**, because there is no server.
- Issues requiring a **already-compromised device**, a malicious browser
  extension, or physical access to an unlocked machine.
- Vulnerabilities in **third-party services you opt into** (Firebase, Google
  APIs) — report those to the respective vendor. Configuration mistakes in your
  own Firebase project (e.g. open Firestore rules) are your responsibility;
  see the in-app Cloud Sync settings for recommended security rules.
- Self-XSS that requires a user to paste attacker-supplied script into their own
  developer console.

## Data handling notes

- **Backups** are exported as JSON carrying an integrity checksum in a signed
  envelope; imports verify the checksum and reject tampered or foreign-origin
  files. (Note: this protects integrity, not confidentiality — exported JSON is
  not encrypted, so store backup files somewhere safe.)
- **Cloud Sync** stores a single document per user in your own Firestore project
  under your Google account; the project, rules, and data are entirely under
  your control.

## Hardening recommendations for self-hosters

If you host your own copy:

- Serve over **HTTPS** (required for service workers and the PWA install flow).
- Consider a strict **Content-Security-Policy** header. The app uses inline
  styles/scripts and lazy-loads the Firebase SDK from a CDN only when Cloud Sync
  is enabled, so account for that if you tighten CSP.
- Keep the deployed file up to date with the latest release.

---

Thank you for helping keep Plant Manager and its users safe.
