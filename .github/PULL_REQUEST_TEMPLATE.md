## Description

<!-- Provide a concise summary of the changes proposed in this pull request. -->

## Motivation and Context

<!-- Why is this change required? What issue or feature does it address? Link relevant issues: fixes #... -->

## Type of Change

- [ ] `feat`: New component, feature, or token export
- [ ] `fix`: Bug fix
- [ ] `docs`: Documentation, roadmap, or template update
- [ ] `refactor`: Code change that neither fixes a bug nor adds a feature
- [ ] `test`: Adding or correcting tests
- [ ] `chore`: Build system, tooling, or maintenance updates

## Verification & Quality Gates

Please verify that all applicable checks pass locally before requesting review:

- [ ] `pnpm test` passes with 0 failures.
- [ ] `pnpm run lint` passes with 0 errors.
- [ ] `pnpm run typecheck` passes with 0 errors.
- [ ] `pnpm run themes:audit` passes contrast standards (AA / AAA).
- [ ] `pnpm run build` succeeds cleanly.
- [ ] `npm pack --dry-run` contains no unintended files (no `.db`, `.sqlite`, `.wal`, or internal memory files).
- [ ] Components use Svelte 5 runes (`$state`, `$props`, `$derived`, `$bindable`, `$effect`) exclusively.
- [ ] Zero runtime dependencies added.
- [ ] No hardcoded colors; CSS variables from `src/tokens/theme.css` are used.
- [ ] All code, comments, documentation, and commit messages are in English.

## Contributor License Agreement (CLA)

- [ ] By submitting this pull request, I confirm that my contributions are licensed under the [Apache License 2.0](./LICENSE) and I agree to the [SWAL Contributor License Agreement](./CLA.md).
