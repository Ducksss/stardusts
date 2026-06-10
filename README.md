# Stardusts

Stardusts is a complete mission workspace for Hack Club Stardance:

- a browser WebOS project ready for the WebOS 1 mission,
- a Slack bot with three slash-command workflows for the Slack Bot mission,
- Hackpad design artifacts and a submission checklist,
- a Stardance mission scraper/CLI that keeps mission metadata current, and
- CI plus GitHub Pages deployment automation.

The repo is intentionally built as a real project instead of a throwaway
submission folder. Each mission has code, docs, tests, and a clear path from
local development to Stardance review.

## Quick Start

```bash
npm install
npm test
npm run build
npm run dev:webos
```

The WebOS runs at the local Vite URL printed by `npm run dev:webos`.

## Mission Map

| Mission | Status | Deliverable |
| --- | --- | --- |
| WebOS 1 | Built | `apps/webos` is a full interactive browser OS. |
| Make a Slack Bot | Built, needs Slack app credentials to go live | `apps/slack-bot` implements `/stardust`, `/mission`, and `/launch`. |
| Hackpad | Design pack prepared | `hardware/hackpad` contains layout, firmware, BOM, and review notes. |
| WebOS 2 | Locked on Stardance | Requires WebOS 1 approval before submission. |

## Commands

```bash
# Fetch live Stardance mission metadata into missions/stardance-missions.json
npm run missions:sync

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
before it truthfully satisfies the live-bot requirement. WebOS 2 is locked until
WebOS 1 is approved in Stardance.
