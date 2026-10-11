---
name: Netlify package-manager selection
description: How Netlify's detected lockfile affects dependency installation before the configured build command.
---

When a repository contains both npm and pnpm lockfiles, Netlify may select pnpm for its dependency-install stage even when `netlify.toml`'s build command invokes npm. This install stage runs before the configured build command and can fail on a stale lockfile first.

**Why:** Netlify's deploy log showed frozen pnpm installation failing on a manifest/lockfile mismatch before the build command ran.

**How to apply:** Keep the selected lockfile synchronized with `package.json`, use the same package manager in the Netlify build command, and validate with a frozen install plus the production build.
