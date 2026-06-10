import { App } from "@slack/bolt";
import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { commandHandlers, slashCommands } from "./commands.js";

const envPaths = [resolve(process.cwd(), ".env"), resolve(process.cwd(), "../../.env")];
for (const path of envPaths) {
  if (existsSync(path)) {
    config({ path, override: false, quiet: true });
  }
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

function optionalEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

const socketMode = process.env.SLACK_SOCKET_MODE !== "false";
const signingSecret = optionalEnv("SLACK_SIGNING_SECRET");

const app = new App({
  appToken: socketMode ? requireEnv("SLACK_APP_TOKEN") : undefined,
  signingSecret: socketMode ? signingSecret : requireEnv("SLACK_SIGNING_SECRET"),
  socketMode,
  token: requireEnv("SLACK_BOT_TOKEN"),
});

app.command(slashCommands.status, async ({ ack, command, respond }) => {
  await ack();
  await respond(commandHandlers.status({ text: command.text, userName: command.user_name }));
});

app.command(slashCommands.mission, async ({ ack, command, respond }) => {
  await ack();
  await respond(commandHandlers.mission({ text: command.text, userName: command.user_name }));
});

app.command(slashCommands.launch, async ({ ack, respond }) => {
  await ack();
  await respond(commandHandlers.launch());
});

app.command(slashCommands.help, async ({ ack, respond }) => {
  await ack();
  await respond(commandHandlers.help());
});

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
if (socketMode) {
  await app.start();
} else {
  await app.start(port);
}
console.log(`Stardusts Slack bot listening${socketMode ? " in Socket Mode" : ` on ${port}`}`);
