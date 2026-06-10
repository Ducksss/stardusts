import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { handleSlackCommandRequest, verifySlackSignature } from "../src/http";

const signingSecret = "test-secret";
const timestamp = "1781090000";
const now = Number.parseInt(timestamp, 10) * 1000;

function signedHeaders(rawBody: string) {
  const signature = createHmac("sha256", signingSecret)
    .update(`v0:${timestamp}:${rawBody}`)
    .digest("hex");

  return {
    "x-slack-request-timestamp": timestamp,
    "x-slack-signature": `v0=${signature}`,
  };
}

describe("Slack HTTP command handler", () => {
  it("verifies a valid Slack signature", () => {
    const rawBody = "command=%2Fstardusts-status&text=&user_name=chai";

    expect(
      verifySlackSignature({
        headers: signedHeaders(rawBody),
        now,
        rawBody,
        signingSecret,
      }),
    ).toBe(true);
  });

  it("rejects stale Slack signatures", () => {
    const rawBody = "command=%2Fstardusts-status&text=&user_name=chai";

    expect(
      verifySlackSignature({
        headers: signedHeaders(rawBody),
        now: now + 10 * 60 * 1000,
        rawBody,
        signingSecret,
      }),
    ).toBe(false);
  });

  it("routes signed slash commands to shared command handlers", () => {
    const rawBody = "command=%2Fstardusts-mission&text=slack&user_name=chai";
    const result = handleSlackCommandRequest({
      headers: signedHeaders(rawBody),
      now,
      rawBody,
      signingSecret,
    });

    expect(result.status).toBe(200);
    expect(result.body.text).toContain("Slack Bot");
  });

  it("rejects unsigned requests", () => {
    const result = handleSlackCommandRequest({
      headers: {},
      rawBody: "command=%2Fstardusts-status",
      signingSecret,
    });

    expect(result.status).toBe(401);
  });
});
