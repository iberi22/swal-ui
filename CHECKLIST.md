# Release Readiness — Impeccable Library

This checklist defines the release gates and quality verification criteria for publishing `@swal/ui` to npm and consuming it across SouthWest AI Labs (SWAL) production applications.

Every item includes the exact verification command. The checks below reflect the live audit performed against the current codebase (`v0.2.0`).

---

## Release Gate Matrix

| Category | Gate Item | Verifying Command | Live Status | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **Legal** | Apache-2.0 License & NOTICE | `test -f LICENSE && test -f NOTICE && grep -q "Apache License, Version 2.0" LICENSE NOTICE` | `[x]` | Apache-2.0 adopted across repository and copyright notices intact. |
| **Docs** | English README Documentation | `test -f README.md && test -s README.md` | `[x]` | Comprehensive guide with installation, component table, and token guide. |
| **Exports** | Exports Map & TypeScript Types | `node -e 'const p = require("./package.json"); if (!p.exports || !p.types) process.exit(1);'` | `[ ]` | Exports map has 24 subpaths, but root `types` field / `index.d.ts` is missing (scheduled for v0.3). |
| **Bundling** | Tree-Shaking & SideEffects | `node -e 'const p = require("./package.json"); if (!Array.isArray(p.sideEffects) || !p.sideEffects.includes("*.css")) process.exit(1);'` | `[x]` | Scoped CSS flagged as `*.css` and `**/*.css` in `sideEffects`. |
| **Dependencies** | Peer Dependencies (`svelte`) | `node -e 'const p = require("./package.json"); if (!p.peerDependencies?.svelte) process.exit(1);'` | `[x]` | `svelte: ^5.0.0` declared as peer dependency; 0 runtime dependencies. |
| **Hygiene** | Clean Tarball (`npm pack`) | `npm pack --dry-run 2>&1 \| grep -E "(code_graph\|xavier_memory\|\.db)"` | `[x]` | Clean 89.0 kB tarball (65 files). Internal database files (`code_graph.db*`, `xavier_memory.db*`) excluded from pack and untracked in git. |
| **CI** | GitHub Actions Workflows Green | `gh run list -R iberi22/swal-ui -L 3 --json conclusion -q '.[].conclusion'` | `[x]` | All recent CI workflows passed (`success`). |
| **Testing** | Automated Test Suite Passing | `pnpm test` | `[x]` | 19 test files passed, 191 unit & DOM tests passing. |
| **Testing** | Code Coverage Tooling | `node -e 'const p = require("./package.json"); if (!p.scripts?.coverage) process.exit(1);'` | `[ ]` | Test suite passing 100%, but coverage threshold script not yet configured in `package.json` (scheduled for v0.3). |
| **A11y** | WCAG 2.2 Contrast & Themes Audit | `pnpm run themes:audit` | `[x]` | Bone theme passes AAA on text and AA on interactive elements in light and dark modes. |
| **Changelog** | Changelog Up to Date | `test -f CHANGELOG.md && test -s CHANGELOG.md` | `[x]` | Follows Keep a Changelog; documents versions 0.1.0 and 0.2.0. |
| **Provenance** | npm Provenance Attestation | `grep -rn "provenance" .github/workflows/` | `[ ]` | CI does not yet feature automated OIDC publishing step with `--provenance` (scheduled for v1.0). |
| **Language** | English-Only Documentation | Repository audit of docs and templates | `[x]` | All public docs, contributing guidelines, templates, and specs in English. (Historical v0.2.0 changelog has bilingual notes). |
| **Security** | Zero Secret Leaks | `grep -rEn "ghp_[A-Za-z0-9]{36}\|github_pat_[A-Za-z0-9]{82}\|AKIA[0-9A-Z]{16}\|AIza[0-9A-Za-z\\-_]{35}" src/` | `[x]` | Scanned source files; 0 secrets or sensitive tokens committed. |
| **Security** | Dependabot Automated Scanning | `test -f .github/dependabot.yml` | `[ ]` | Not yet merged on `main` (currently active in open PR #27 `chore(deps): group Dependabot...`). |

---

## Detailed Check Verification

### 1. Legal & Licensing
```bash
# Verify LICENSE and NOTICE existence and Apache 2.0 license declaration
test -f LICENSE && test -f NOTICE && grep -q "Apache License, Version 2.0" LICENSE NOTICE
# Exit code: 0 (PASSED)
```

### 2. Documentation
```bash
# Verify README exists and has non-zero size
test -f README.md && test -s README.md
# Exit code: 0 (PASSED)
```

### 3. Exports Map & TypeScript Declarations
```bash
# Check exports map and root type declaration
node -e 'const p = require("./package.json"); console.log("exports:", !!p.exports, "root types:", !!p.types);'
# Output: exports: true root types: false
# Exit code: 0 (INCOMPLETE: subpath exports present, root types pending Milestone 0.3)
```

### 4. Side Effects & Tree Shaking
```bash
# Verify sideEffects correctly identifies CSS files
node -e 'const p = require("./package.json"); if (!Array.isArray(p.sideEffects) || !p.sideEffects.includes("*.css")) process.exit(1);'
# Exit code: 0 (PASSED)
```

### 5. Peer Dependencies
```bash
# Verify svelte is declared as peer dependency with version ^5.0.0
node -e 'const p = require("./package.json"); if (!p.peerDependencies?.svelte) process.exit(1);'
# Exit code: 0 (PASSED)
```

### 6. Package Tarball Cleanliness
```bash
# Verify tarball contents exclude SQLite databases and development memory stores
npm pack --dry-run 2>&1 | grep -E "(code_graph|xavier_memory|\.db)"
# Output: empty (No database files included)

# Verify git tracking state of internal database files
git ls-files code_graph.db* xavier_memory.db*
# Output: empty (Zero files tracked)
# Exit code: 0 (PASSED)
```

### 7. Continuous Integration
```bash
# Verify latest GitHub Actions runs succeeded
gh run list -R iberi22/swal-ui -L 3 --json conclusion -q '.[].conclusion'
# Output: success success success
# Exit code: 0 (PASSED)
```

### 8. Automated Test Suite
```bash
# Run Vitest test suite
pnpm test
# Output: 19 test files passed, 191 tests passed (Duration ~6.4s)
# Exit code: 0 (PASSED)
```

### 9. Theme Contrast & Accessibility
```bash
# Run themes contrast audit
pnpm run themes:audit
# Output: Bone complies with contract and passes AA/AAA in light and dark
# Exit code: 0 (PASSED)
```

### 10. Secret Scanning
```bash
# Search for API keys, personal tokens, and secrets
grep -rEn "ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9]{82}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z\\-_]{35}" src/ || echo "CLEAN"
# Output: CLEAN
# Exit code: 0 (PASSED)
```

---

## Release Procedure (For Maintainers)

When preparing a new release (`v0.x.x` or `v1.0.0`):

1. **Clean Workspace**: Ensure git tree is clean and on latest `main`.
2. **Execute Audit**: Run all checkable commands listed in this checklist.
3. **Build Artifacts**:
   ```bash
   pnpm run lint
   pnpm run typecheck
   pnpm test
   pnpm run build
   ```
4. **Dry Run Pack**:
   ```bash
   npm pack --dry-run
   ```
   Verify tarball file list, file count, and byte sizes.
5. **Tag & Release**:
   ```bash
   git tag -a v<VERSION> -m "Release v<VERSION>"
   git push origin v<VERSION>
   ```
