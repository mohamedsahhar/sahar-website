# Sa7ar Website Codex Rules

## Critical scope rule

Only modify files explicitly required by the current task.

Do not refactor, clean up, optimize, rewrite, reorder, rename, delete, or modify unrelated code or files.

If the task is small, the code change must also be small.

## Protected homepage sections

Never remove, rewrite, hide, reorder, or replace these homepage sections unless the user explicitly asks for that exact section to be changed:

- RelatedNews video/news section
- Customer Reviews
- Latest Repair Cases
- Why Choose Us
- Hero CTA links and WhatsApp CTA
- Current homepage structure

The RelatedNews section depends on:

- app/components/RelatedNews.tsx
- public/news/video-a.mp4
- public/news/video-b.mp4
- public/news/video-c.mp4

Never delete or replace these files unless explicitly requested.

## Navbar-only task rule

For Navbar-only tasks, allowed files must normally be limited to:

- app/components/Navbar.tsx

Do not touch:

- app/(site)/page.tsx
- app/components/RelatedNews.tsx
- public/news/*
- homepage components
- admin pages
- API routes
- Prisma schema
- database files
- repair cases/devices/brands pages
- Footer or Logo unless explicitly requested

## Protected admin structure rule

Admin shell/layout/security files are protected. Do not edit, move, delete, or refactor them during normal admin page updates. If a task seems to require changing them, stop first and report the file name, reason, risk, and exact expected behavior. Wait for explicit owner approval before editing.

Protected files:

- app/admin/layout.tsx
- app/admin/(protected)/layout.tsx
- app/admin/AdminShell.tsx
- middleware.ts
- app/api/auth/[...nextauth]/route.ts
- any Google Analytics file or script

Any admin page change must preserve the existing AdminShell/navbar/header and must not change global admin dimensions, wrappers, spacing, or mobile/desktop layout unless the task explicitly asks for layout changes.

## Before finishing any task

Always run:

git status
git diff --name-only

Then verify all changed files are expected for the task.

If any unexpected file changed, revert it before reporting.

## Build rule

For code changes, run:

npm.cmd run build

Report the build result and any warnings.

## Reporting rule

At the end of every task, report:

- Files changed
- Files intentionally not touched
- Build result
- Any warnings
- Whether unexpected files were changed and reverted

## Commit rule

Do not commit or push unless the user explicitly asks.

One task should produce one small focused change.

## Windows rule

Use Windows CMD-compatible commands only.

Do not use Unix-only commands such as rm -rf.
