# Stardance Submission Plan

## WebOS 1

Evidence to attach:

- GitHub repo: the `stardusts` repository.
- Live URL: `https://ducksss.github.io/stardusts/` after the Pages workflow
  finishes on `main`.
- Notes: the OS opens directly into an interactive desktop with draggable
  windows, a dock, terminal commands, mission checklist, devlog editor, browser
  mock, and soundboard utilities.

Reviewer checklist:

- The site loads as a web page.
- It looks and behaves like an OS, not a landing page.
- Multiple apps/windows are interactive.
- The theme is custom and mission-oriented.
- There is no password or gate before the reviewer can test it.

Ready-to-paste reviewer note:

```text
Stardusts OS is a browser-based mission desktop with draggable windows, a dock,
terminal commands, mission tracking, devlog notes, a mini browser, a tiny tools
panel, and project-specific Slack/Hackpad/ship windows. It uses a custom visual
theme and adds a terminal command launcher beyond the base guide.
```

## Slack Bot

Evidence to attach after credentials are configured:

- GitHub repo: `apps/slack-bot`.
- Hosting URL: Render/Fly/VPS URL or Socket Mode logs.
- Slash command demo: `/stardusts`, `/stardusts-mission`, and
  `/stardusts-launch`.

Reviewer checklist:

- Bot is installed in a Slack workspace.
- At least three commands/functions work.
- Command names are namespaced enough to avoid collisions.
- Bot is hosted 24/7.

Do not submit this mission for final review until live credentials and hosting
are configured.

Ready-to-paste reviewer note after deployment:

```text
The Stardusts Slack bot is installed and hosted 24/7. It provides three
namespaced slash commands: /stardusts for mission readiness, /stardusts-mission
for mission-specific checklists, and /stardusts-launch for a launch plan.
```

## Hackpad

Evidence to attach after hardware validation:

- Layout and firmware in `hardware/hackpad`.
- Generated KiCad PCB and DXF outlines in `hardware/hackpad/generated`.
- BOM and case notes.
- KiCad PCB screenshots or gerbers once exported from the guide workflow.

Reviewer checklist:

- Custom mini keyboard concept is original.
- Matrix, firmware, and BOM are coherent.
- PCB/case artifacts are attached and manufacturable.

## WebOS 2

Local upgrade work is ready. Submit only after WebOS 1 approval unlocks this
mission in Stardance.

Evidence to attach:

- GitHub repo: the `stardusts` repository with the updated `apps/webos`
  project.
- Live URL: `https://ducksss.github.io/stardusts/` after the Pages workflow
  deploys the WebOS 2 build.
- Screenshots or recording showing the new Theme Studio, Launchpad, and
  Submission Capsule apps.

Reviewer checklist:

- Theme Studio changes the desktop colors, wallpaper preset, glass level, star
  density, and motion setting live.
- Launchpad searches across app names and keywords, then opens matching
  windows.
- Submission Capsule exports a reviewer-ready snapshot with the three WebOS 2
  features listed.

Ready-to-paste reviewer note:

```text
Stardusts OS has three WebOS 2 upgrades beyond the original WebOS 1 desktop:
Theme Studio for live persistent theme customization, Launchpad for searchable
app launching, and Submission Capsule for a copyable reviewer evidence snapshot.
The upgrade keeps the draggable desktop, dock, terminal, mission checklist, and
project-specific apps from WebOS 1.
```
