import * as assert from "assert";
import { ConfigurationService } from "../configurationService";
import { Button } from "../models";

suite("ConfigurationService Test Suite", () => {
  let configService: ConfigurationService;

  setup(() => {
    configService = new ConfigurationService();
  });

  suite("mergeButtons", () => {
    test("should return empty array when both inputs are empty", () => {
      const result = configService.mergeButtons([], []);
      assert.deepStrictEqual(result, []);
    });

    test("should return user buttons when workspace buttons are empty", () => {
      const userButtons: Button[] = [
        { title: "Button 1", command: "echo 1" },
        { title: "Button 2", command: "echo 2" },
      ];

      const result = configService.mergeButtons(userButtons, []);
      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0].title, "Button 1");
      assert.strictEqual(result[1].title, "Button 2");
    });

    test("should return workspace buttons when user buttons are empty", () => {
      const workspaceButtons: Button[] = [
        { title: "Workspace Button 1", command: "npm test" },
      ];

      const result = configService.mergeButtons([], workspaceButtons);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].title, "Workspace Button 1");
    });

    test("should merge buttons from user and workspace", () => {
      const userButtons: Button[] = [
        { title: "User Button 1", command: "echo user" },
      ];
      const workspaceButtons: Button[] = [
        { title: "Workspace Button 2", command: "echo workspace" },
      ];

      const result = configService.mergeButtons(userButtons, workspaceButtons);
      assert.strictEqual(result.length, 2);
    });

    test("should override user button with workspace button when title+command match", () => {
      const userButtons: Button[] = [
        { title: "Build", command: "npm run build", icon: "user-icon" },
      ];
      const workspaceButtons: Button[] = [
        { title: "Build", command: "npm run build", icon: "workspace-icon" },
      ];

      const result = configService.mergeButtons(userButtons, workspaceButtons);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].title, "Build");
      assert.strictEqual(result[0].icon, "workspace-icon");
    });

    test("should preserve button section during merge", () => {
      const userButtons: Button[] = [
        { title: "Button 1", command: "cmd1", section: "Build" },
      ];
      const workspaceButtons: Button[] = [
        { title: "Button 2", command: "cmd2", section: "Test" },
      ];

      const result = configService.mergeButtons(userButtons, workspaceButtons);
      const btn1 = result.find((b) => b.title === "Button 1");
      const btn2 = result.find((b) => b.title === "Button 2");

      assert.strictEqual(btn1?.section, "Build");
      assert.strictEqual(btn2?.section, "Test");
    });

    test("should skip buttons without title", () => {
      const userButtons: Button[] = [
        { title: "", command: "invalid" },
        { title: "Valid Button", command: "valid" },
      ];

      const result = configService.mergeButtons(userButtons, []);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].title, "Valid Button");
    });

    test("should skip buttons without command", () => {
      const userButtons: Button[] = [
        { title: "Invalid", command: "" },
        { title: "Valid Button", command: "valid" },
      ];

      const result = configService.mergeButtons(userButtons, []);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].title, "Valid Button");
    });

    test("should preserve tooltip during merge", () => {
      const userButtons: Button[] = [
        { title: "Button", command: "cmd", tooltip: "User tooltip" },
      ];

      const result = configService.mergeButtons(userButtons, []);
      assert.strictEqual(result[0].tooltip, "User tooltip");
    });

    test("should keep buttons with same title but different commands", () => {
      const userButtons: Button[] = [
        { title: "Build", command: "npm run build" },
        { title: "Build", command: "yarn build" },
      ];

      const result = configService.mergeButtons(userButtons, []);
      assert.strictEqual(result.length, 2);
    });
  });
});
