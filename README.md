# Stardusts

Stardusts is a complete mission workspace for Hack Club Stardance:

- a browser WebOS project ready for the WebOS 1 mission,
- a WebOS 2 upgrade layer with custom theming, app search, and submission
  evidence export,
- a Slack bot with three slash-command workflows for the Slack Bot mission,
- Hackpad design artifacts and a submission checklist,
- a Stardance mission scraper/CLI that keeps mission metadata current, and
- CI plus GitHub Pages deployment automation.

The repo is intentionally built as a real project instead of a throwaway
submission folder. Software missions include code, docs, tests, and a clear path
from local development to Stardance review; the Hackpad mission includes
hardware design artifacts, firmware scaffolding, and fabrication notes.

## Quick Start

```bash
npm install
npm test
npm run build
npm run dev:webos
```

The WebOS runs at the local Vite URL printed by `npm run dev:webos`.
After `main` deploys, the review URL is `https://ducksss.github.io/stardusts/`.

## Mission Map

These statuses describe local repo readiness, not Stardance portal approval.

| Mission | Local status | Deliverable |
| --- | --- | --- |
| WebOS 1 | Built | `apps/webos` is a full interactive browser OS. |
| WebOS 2 | Prepared, pending Stardance portal unlock | `apps/webos` adds Theme Studio, Launchpad, and Submission Capsule beyond WebOS 1. |
| Make a Slack Bot | Built, needs Slack app credentials to go live | `apps/slack-bot` implements `/stardusts`, `/stardusts-mission`, and `/stardusts-launch`. |
| Hackpad | Design pack prepared | `hardware/hackpad` contains layout, generated PCB/outlines, firmware, BOM, and review notes. |

## Commands

```bash
# Fetch live Stardance mission metadata into missions/stardance-missions.json
npm run missions:sync

# Regenerate Hackpad KiCad PCB and DXF outline artifacts
npm run hackpad:generate

# Run every test suite
npm test

# Type-check all workspaces
npm run typecheck

# Build every workspace
npm run build
```

## Project Structure

```text
apps/webos              Browser WebOS mission project
apps/slack-bot          Slack command app and deployment files
hardware/hackpad        Keyboard design pack, BOM, QMK keymap, case
packages/stardance-cli  Mission scraping and project scaffolding CLI
docs/                   Submission notes and operating docs
missions/               Generated mission metadata
```

## Stardance Submission Boundaries

The repo prepares mission artifacts and browser-ready links, but it does not
fake review state. Slack Bot still needs real Slack credentials and a 24/7 host
before it truthfully satisfies the live-bot requirement. WebOS 2 features are
implemented locally, but the mission still requires WebOS 1 approval before the
portal accepts a submission.
