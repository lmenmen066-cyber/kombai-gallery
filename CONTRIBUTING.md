# Contributing

Thanks for helping! This repo is a Next.js 16 + React 19 + Tailwind 4 design system and
showcase, kept green by CI, branch protection, a merge queue, Dependabot, and a tag-based
release flow.

## Getting started

```bash
git clone https://github.com/lmenmen066-cyber/kombai-gallery.git
cd kombai-gallery
npm install
npm run dev        # http://localhost:3000
```

> If a clean install fails on native postinstall scripts, ensure Node 22 and let CI
> (`npm ci`) validate — the production build is network-independent (fonts are vendored).

## Quality gates (run these before opening a PR)

```bash
npm run typecheck          # tsc --noEmit
npm run lint               # eslint . (flat config)
npm run build              # next build — all routes must prerender statically
node scripts/contrast-audit.mjs   # WCAG report; hard (<3.0:1) failures fail CI
```

CI mirrors these as two required checks — **Lint** and **Build** — that must pass before a
PR can merge (via the merge queue).

## Making a change (PR flow)

1. Branch off `main`: `git checkout -b feat/...`.
2. Commit with a conventional prefix (`feat:` / `fix:` / `chore:` / `docs:`).
3. `git push -u origin <branch>` and open a PR into `main` (the PR template lists the checks).
4. Required checks run; when **Lint** and **Build** are green the PR enters the **merge
   queue**, rebases onto latest `main`, and merges automatically. You never merge by hand.
5. `main` is protected — do not force-push or delete it.

## Dependency updates

Dependabot opens PRs: **version updates** (weekly — Actions + npm; non-major grouped and
auto-merged on green) and **security updates** (immediate patch PRs for CVEs). Majors are
left for human review — pair them with their companions (e.g. `tailwind-merge` only after
Tailwind v4).

## Cutting a release

Releases are tagged `vX.Y.Z` and published automatically by `.github/workflows/release.yml`.
The tag **must** match `package.json` and have a CHANGELOG entry, or the release aborts.

```bash
# 1) On a branch: update CHANGELOG.md (add a "## [X.Y.Z]" section) and bump
#    package.json's "version" to X.Y.Z. Open a PR, let it merge via the queue.
git checkout main && git pull

# 2) Tag the freshly-merged main and push the tag -> Release workflow builds the
#    tagged commit (a real build gate), enforces version consistency, then creates
#    a GitHub Release with generated notes + CHANGELOG/contrast-report assets.
git tag -a v0.2.0 -m "v0.2.0"
git push origin v0.2.0

# 3) Verify
gh release view v0.2.0
```

If `package.json`, the tag, and the CHANGELOG disagree, the `Enforce version consistency`
step fails the run and no release is published — fix the mismatch and re-tag.

## Vercel previews (optional)

`.github/workflows/vercel-preview.yml` comments a per-PR preview URL, but it is **opt-in**
and **inert by default** — the job is skipped until you enable it (so it never fails a PR).
Production already deploys to GitHub Pages; this is only for branch-preview links.

To turn it on (one-time; requires a Vercel account):

1. Create/attach a Vercel project for this repo (import the GitHub repo at vercel.com/new),
   or just note its Project ID + Org ID.
2. Set the three secrets the workflow needs:
   ```bash
   gh secret set VERCEL_TOKEN      # from https://vercel.com/account/tokens
   gh secret set VERCEL_ORG_ID
   gh secret set VERCEL_PROJECT_ID
   ```
3. Flip the gate on:
   ```bash
   gh variable set VERCEL_PREVIEW_ENABLED --body true
   ```

After that, every PR posts a Vercel preview URL. To disable, set the variable to `false`
(or remove it) — the job returns to being skipped. (Alternatively, install Vercel's GitHub
App for zero-config previews; then you don't need this workflow at all.)

