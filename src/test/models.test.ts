import * as assert from "assert";
import { Button } from "../models";

suite("Models Test Suite", () => {
  suite("Button Interface", () => {
    test("should create a button with required fields", () => {
      const button: Button = {
        title: "Test Button",
        command: 'echo "hello"',
      };

      assert.strictEqual(button.title, "Test Button");
      assert.strictEqual(button.command, 'echo "hello"');
      assert.strictEqual(button.section, undefined);
      assert.strictEqual(button.icon, undefined);
      assert.strictEqual(button.tooltip, undefined);
    });

    test("should create a button with all fields", () => {
      const button: Button = {
        title: "Test Button",
        command: "npm run test",
        section: "Testing",
        icon: "play",
        tooltip: "Run tests",
      };

      assert.strictEqual(button.title, "Test Button");
      assert.strictEqual(button.command, "npm run test");
      assert.strictEqual(button.section, "Testing");
      assert.strictEqual(button.icon, "play");
      assert.strictEqual(button.tooltip, "Run tests");
    });

    test("should allow buttons with same section name", () => {
      const buttons: Button[] = [
        { title: "Button 1", command: "cmd1", section: "Build" },
        { title: "Button 2", command: "cmd2", section: "Build" },
        { title: "Button 3", command: "cmd3", section: "Test" },
      ];

      const buildButtons = buttons.filter((b) => b.section === "Build");
      assert.strictEqual(buildButtons.length, 2);
    });
  });
});
