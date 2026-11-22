---
title: REvolver (Resume Evolver)
category: projects
aliases: revolver, resume evolver, resume tailoring, google apps script, openrouter, bookmarklet, automation, google sheets, google docs
action: open:revolver
---

## Overview

**REvolver (Resume Evolver)** is a zero-cost, serverless AI resume-tailoring workflow built entirely inside the Google Ecosystem. Instead of manually editing resumes for every application or paying for SaaS wrappers, it pairs a structured Google Sheets career database with Google Apps Script, Google Docs templates, OpenRouter APIs, and a browser bookmarklet to generate tailored resumes in seconds.

- **GitHub:** https://github.com/HiSiddharth/REvolver

## How It Works

1. **Capture on Any Job Board:** Highlight a job description on any webpage and click the **Tailor Resume** browser bookmarklet.
2. **Verify Context:** Confirm or tweak the auto-extracted company name, job title, and job description inside the injected modal overlay.
3. **Serverless Selection & Generation:** Google Apps Script queries OpenRouter (`google/gemini-2.5-flash` by default) against the master career database to select and tailor the most relevant entries.
4. **Template Population & Cleanup:** Injects the tailored content into a formatted Google Docs template (`{{EXP_%d_ROLE}}`, `{{PROJECT_%d_TITLE}}`, `{{SKILL_GROUP_%d_SKILLS}}`, etc.), automatically stripping unused placeholder blocks so formatting stays clean.
5. **Instant Redirect:** Saves the finished resume to a target Google Drive folder and redirects the browser straight to the generated document.

## Architecture & Components

- **Master Career Database (Google Sheets):** Single `Database` tab storing categorized career history (`Exp`, `prj`, `Crt`, `skills`, `por`), tech stacks, links, and `Duplicate Group` tags to prevent redundant entries from being picked together.
- **Dynamic Document Engine (Google Docs + Apps Script):** Uses `Code.js` and `Index.html` deployed as an Apps Script Web App, pulling external system prompts (`PROMPT_DOC_ID`) and API keys from Script Properties so logic and prompts can be updated without redeploying code.
- **Zero-Extension Browser Trigger (`bookmarklet.js`):** Minified `javascript:` payload (with a Python helper script for minification) that works directly from the bookmarks bar without needing browser extension permissions.
