---
name: Imported Node projects
description: A setup lesson for imported JavaScript projects whose dependencies are not present in the workspace.
---

Imported Node projects can have a valid package manifest and lockfile but no installed dependencies, causing the workflow to fail with missing-package errors before the app starts.

**Why:** A GitHub import does not guarantee that `node_modules` is present in the new workspace.

**How to apply:** When an imported Node workflow fails with missing packages, install the dependencies declared by the existing package manifest using the workspace package-management flow, then restart the existing workflow and verify both the preview and build.