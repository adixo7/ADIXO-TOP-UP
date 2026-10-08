---
name: Mockup sandbox setup
description: Dependency installation behavior for isolated component-preview artifacts.
---

After creating a mockup-sandbox artifact, verify that its own dependencies are installed before starting its preview workflow. A populated package manifest alone does not mean the artifact's modules are available.

**Why:** The generated sandbox declared its Vite and Tailwind dependencies, but the preview workflow could not resolve them until the sandbox's packages were installed separately. Installing there kept the main app dependency files unchanged.

**How to apply:** Check the artifact-local install state and use the mockup-sandbox instructions to install its declared dependencies before restarting the preview workflow.
