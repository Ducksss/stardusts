import { createHmac, timingSafeEqual } from "node:crypto";
import { commandHandlers, slashCommands, type CommandResponse } from "./commands.js";

export type SlackHttpResult = {
  body: CommandResponse | { error: string; ok: false };
  status: number;
};

export type SlackHttpHeaders = {
  "x-slack-request-timestamp"?: string | string[];
  "x-slack-signature"?: string | string[];
};

const maxSignatureAgeMs = 5 * 60 * 1000;

function headerValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function safeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifySlackSignature({
  headers,
  now = Date.now(),
  rawBody,
  signingSecret,
}: {
  headers: SlackHttpHeaders;
  now?: number;
  rawBody: string;
  signingSecret: string;
}): boolean {
  const timestamp = headerValue(headers["x-slack-request-timestamp"]);
  const signature = headerValue(headers["x-slack-signature"]);
  if (!timestamp || !signature) return false;

  const timestampMs = Number.parseInt(timestamp, 10) * 1000;
  if (!Number.isFinite(timestampMs) || Math.abs(now - timestampMs) > maxSignatureAgeMs) {
    return false;
  }

  const digest = createHmac("sha256", signingSecret)
    .update(`v0:${timestamp}:${rawBody}`)
    .digest("hex");

  return safeCompare(`v0=${digest}`, signature);
}

export function handleSlackCommandRequest({
  headers,
  now,
  rawBody,
  signingSecret,
}: {
  headers: SlackHttpHeaders;
  now?: number;
  rawBody: string;
  signingSecret?: string;
}): SlackHttpResult {
  if (!signingSecret) {
    return {
      body: { error: "SLACK_SIGNING_SECRET is not configured", ok: false },
      status: 500,
    };
  }

  if (!verifySlackSignature({ headers, now, rawBody, signingSecret })) {
    return {
      body: { error: "Slack request signature verification failed", ok: false },
      status: 401,
    };
  }

  const form = new URLSearchParams(rawBody);
  const command = form.get("command");
  const text = form.get("text") ?? "";
  const userName = form.get("user_name") ?? undefined;

  switch (command) {
    case slashCommands.status:
      return {
        body: commandHandlers.status({ text, userName }),
        status: 200,
      };
    case slashCommands.mission:
      return {
        body: commandHandlers.mission({ text, userName }),
        status: 200,
      };
    case slashCommands.launch:
      return {
        body: commandHandlers.launch(),
        status: 200,
      };
    case slashCommands.help:
      return {
        body: commandHandlers.help(),
        status: 200,
      };
    default:
      return {
        body: {
          response_type: "ephemeral",
          text: `Unknown command. Run ${slashCommands.help} for the supported Stardusts commands.`,
        },
        status: 200,
      };
  }
}
