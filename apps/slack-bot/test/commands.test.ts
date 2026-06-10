import { describe, expect, it } from "vitest";
import {
  commandDefinitions,
  helpCommand,
  launchCommand,
  missionCommand,
  slashCommands,
  statusCommand,
} from "../src/commands";

describe("Slack command handlers", () => {
  it("uses a collision-resistant command namespace", () => {
    expect(Object.values(slashCommands)).toEqual([
      "/stardusts-help",
      "/stardusts-launch",
      "/stardusts-mission",
      "/stardusts-status",
    ]);
    expect(new Set(Object.values(slashCommands)).size).toBe(Object.values(slashCommands).length);
    expect(commandDefinitions).toHaveLength(4);
  });

  it("returns mission readiness for /stardusts-status", () => {
    const response = statusCommand({ uptimeSeconds: 65, userName: "chai" });

    expect(response.response_type).toBe("ephemeral");
    expect(response.text).toContain("online for chai");
    expect(JSON.stringify(response.blocks)).toContain("WebOS 1");
    expect(JSON.stringify(response.blocks)).toContain("Slack Bot");
    expect(JSON.stringify(response.blocks)).toContain("1m 5s");
  });

  it("returns focused mission state for /stardusts-mission", () => {
    expect(missionCommand({ text: "slack" }).text).toContain("Slack Bot");
    expect(missionCommand({ text: "webos2" }).text).toContain("locked");
    expect(missionCommand({ text: "unknown" }).text).toContain("Unknown mission");
  });

  it("posts the /stardusts-launch command in-channel", () => {
    const response = launchCommand();

    expect(response.response_type).toBe("in_channel");
    expect(response.text).toContain("launch plan");
  });

  it("lists every command in /stardusts-help", () => {
    const response = helpCommand();
    const serialized = JSON.stringify(response.blocks);

    expect(response.response_type).toBe("ephemeral");
    expect(response.text).toContain("commands");
    expect(serialized).toContain(slashCommands.status);
    expect(serialized).toContain(slashCommands.mission);
    expect(serialized).toContain(slashCommands.launch);
    expect(serialized).toContain(slashCommands.help);
  });
});
