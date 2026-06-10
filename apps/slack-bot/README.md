# Stardusts Slack Bot

This bot is designed for the Stardance Slack Bot mission. It implements three
slash-command workflows:

- `/stardust` reports mission readiness.
- `/mission <name>` returns a checklist for WebOS, Slack Bot, Hackpad, or WebOS 2.
- `/launch` returns the current launch plan.

## Local Development

```bash
cp ../../.env.example ../../.env
npm --workspace @stardusts/slack-bot run dev
```

Required environment variables:

- `SLACK_BOT_TOKEN`
- `SLACK_SIGNING_SECRET`
- `SLACK_APP_TOKEN` for Socket Mode
- `SLACK_SOCKET_MODE=true` for Socket Mode deployments

## Deployment

Socket Mode is the fastest 24/7 path on Render, Fly, Railway, or a VPS because
it does not need a public request URL. For HTTP mode, set `SLACK_SOCKET_MODE`
to `false`, expose `POST /slack/events`, and point Slack Interactivity & Slash
Commands to that URL.

Do not submit this mission on Stardance until the bot is installed in a real
Slack workspace and hosted continuously.
