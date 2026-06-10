import { App } from "@slack/bolt";
import { commandHandlers } from "./commands.js";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

const socketMode = process.env.SLACK_SOCKET_MODE !== "false";

const app = new App({
  appToken: socketMode ? requireEnv("SLACK_APP_TOKEN") : undefined,
  signingSecret: requireEnv("SLACK_SIGNING_SECRET"),
  socketMode,
  token: requireEnv("SLACK_BOT_TOKEN"),
});

app.command("/stardust", async ({ ack, command, respond }) => {
  await ack();
  await respond(commandHandlers.stardust({ text: command.text, userName: command.user_name }));
});

app.command("/mission", async ({ ack, command, respond }) => {
  await ack();
  await respond(commandHandlers.mission({ text: command.text, userName: command.user_name }));
});

app.command("/launch", async ({ ack, respond }) => {
  await ack();
  await respond(commandHandlers.launch());
});

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
if (socketMode) {
  await app.start();
} else {
  await app.start(port);
}
console.log(`Stardusts Slack bot listening${socketMode ? " in Socket Mode" : ` on ${port}`}`);
