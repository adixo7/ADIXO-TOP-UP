---
name: Portable npm lockfiles
description: Keep package-lock files usable outside the Replit package firewall.
---

When an imported Node project will build on an external CI provider, package-lock.json must resolve packages through public npm URLs rather than Replit-only package-firewall hosts.

**Why:** Replit's package installation can preserve internal tarball URLs in the lockfile; Netlify and other external builders cannot resolve those hosts and fail during dependency installation before the project build starts.

**How to apply:** Before external publishing, search the lockfile for package-firewall.replit.local or package-firewall.replit.internal and normalize those resolved URLs to the corresponding https://registry.npmjs.org package paths, then validate the build with the same clean-install path.