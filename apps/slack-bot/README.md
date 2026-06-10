# Stardusts Slack Bot

Mission-ready Slack bot for the Stardance "Make a Slack Bot" mission. It uses
Slack Bolt for JavaScript, Socket Mode by default, and a `stardusts` command
namespace so the slash commands do not collide with other Hack Club Slack bots.

## Mission Coverage

| Requirement | Implementation |
| --- | --- |
| Bot responds to messages | Bolt app registers slash command handlers in `src/index.ts`. |
| At least 3 commands/functions | Four commands are implemented and tested. |
| Commands do not collide | Every command uses the `/stardusts-*` namespace. |
| Live 24/7 | Dockerfile and systemd service template are included. |

## Slash Commands

Register these exact commands in the Slack app dashboard:

| Command | Usage hint | What it does |
| --- | --- | --- |
| `/stardusts-status` | none | Shows bot uptime, namespace, and mission readiness. |
| `/stardusts-mission` | `[webos\|slack\|hackpad\|webos2]` | Returns a focused mission status. |
| `/stardusts-launch` | none | Posts the current launch checklist in-channel. |
| `/stardusts-help` | none | Lists every supported command. |

## Slack App Setup

Create a Slack app with Socket Mode enabled, then add:

- App-level token scope: `connections:write`
- Bot token scopes: `commands`, `chat:write`
- Slash commands: the four `/stardusts-*` commands listed above

The app needs these environment variables for Socket Mode:

```bash
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-socket-mode-token
SLACK_SOCKET_MODE=true
```

`SLACK_SIGNING_SECRET` is only required when `SLACK_SOCKET_MODE=false` and Slack
sends HTTP requests to the bot.

## Local Development

From the repo root:

```bash
cp .env.example .env
# Fill in real Slack tokens before running the bot.
npm --workspace @stardusts/slack-bot run dev
```

The bot also loads `apps/slack-bot/.env`, so either location works. Do not
commit real tokens; `.env` files are gitignored.

## Verification

```bash
npm --workspace @stardusts/slack-bot test
npm --workspace @stardusts/slack-bot run typecheck
npm --workspace @stardusts/slack-bot run build
```

## 24/7 Nest Deployment

On the server:

```bash
git clone https://github.com/YOUR_USERNAME/stardusts.git
cd stardusts
npm ci
npm --workspace @stardusts/slack-bot run build
cp .env.example .env
nano .env
npm --workspace @stardusts/slack-bot start
```

After confirming the commands respond in Slack, install the user service:

```bash
mkdir -p ~/.config/systemd/user
cp apps/slack-bot/deploy/stardusts-slack-bot.service ~/.config/systemd/user/
sed -i "s|/home/YOUR_NEST_USER/stardusts|$PWD|" ~/.config/systemd/user/stardusts-slack-bot.service
systemctl --user daemon-reload
systemctl --user enable --now stardusts-slack-bot.service
systemctl --user status stardusts-slack-bot.service
```

Useful operations:

```bash
systemctl --user restart stardusts-slack-bot.service
journalctl --user -u stardusts-slack-bot.service -f
```
