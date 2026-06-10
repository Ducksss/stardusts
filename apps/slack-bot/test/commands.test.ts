import { describe, expect, it } from "vitest";
import { launchCommand, missionCommand, stardustCommand } from "../src/commands";

describe("Slack command handlers", () => {
  it("returns mission readiness for /stardust", () => {
    const response = stardustCommand({ userName: "chai" });

    expect(response.response_type).toBe("ephemeral");
    expect(response.text).toContain("for chai");
    expect(JSON.stringify(response.blocks)).toContain("WebOS 1");
    expect(JSON.stringify(response.blocks)).toContain("Slack Bot");
  });

  it("returns focused mission state for /mission", () => {
    expect(missionCommand({ text: "slack" }).text).toContain("Slack Bot");
    expect(missionCommand({ text: "webos2" }).text).toContain("locked");
    expect(missionCommand({ text: "unknown" }).text).toContain("Unknown mission");
  });

  it("posts the launch command in-channel", () => {
    const response = launchCommand();

    expect(response.response_type).toBe("in_channel");
    expect(response.text).toContain("launch plan");
  });
});
