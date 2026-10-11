# Security Policy — SouthWest AI Labs (SWAL)

SouthWest AI Labs (SWAL) takes the security of our open-source software libraries seriously. This document outlines our security policy, supported versions, and how to report vulnerabilities in `@swal/ui`.

---

## Supported Versions

Only the latest active minor release line receives security updates and vulnerability patches.

| Version | Supported | Notes |
| :--- | :---: | :--- |
| `0.2.x` | Yes | Current stable release line |
| `< 0.2.0` | No | Pre-release / development snapshots |

---

## Reporting a Vulnerability

If you discover a potential security vulnerability within `@swal/ui`, please **do not open a public issue**. Disclose it responsibly through our coordinated security channel:

1. **Email Contact**: Send details to `security@southwestailabs.org`.
2. **Confidential Report**: If you have access to GitHub Private Vulnerability Reporting on this repository, you may submit an advisory directly via the GitHub Security tab.
3. **Required Details**:
   - Component or module affected (e.g., `CommandPalette.svelte`, `src/lib/storage.js`).
   - Description of the vulnerability and attack vector.
   - Proof of concept (PoC) or minimal reproduction steps.
   - Potential impact on client applications.

### Response SLA
- **Initial Acknowledgment**: Within **48 hours**.
- **Assessment & Triage**: Within **5 business days**.
- **Coordinated Disclosure**: Fix release and public advisory published in accordance with coordinated vulnerability disclosure standards.

---

## Security Practices in @swal/ui

- **Zero Runtime Dependencies**: The core package relies solely on native browser APIs and the Svelte peer dependency (`^5.0.0`), significantly reducing supply chain risk.
- **Safe DOM Rendering**: Components do not use `eval()` or unescaped `@html` injection with unsanitized user content.
- **Secret Scanning**: Automated scans prevent credentials, private keys, or internal tokens from entering the repository.
- **Dependency Auditing**: Development dependencies are audited regularly using `pnpm audit` and automated Dependabot alerts.
