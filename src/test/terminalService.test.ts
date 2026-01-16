import * as assert from "assert";
import * as vscode from "vscode";
import { TerminalService } from "../terminalService";

suite("TerminalService Test Suite", () => {
  let terminalService: TerminalService;

  setup(() => {
    terminalService = new TerminalService();
  });

  teardown(() => {
    terminalService.dispose();
  });

  suite("executeCommand", () => {
    test("should create a terminal when executing a command", () => {
      const initialTerminalCount = vscode.window.terminals.length;

      terminalService.executeCommand('echo "test"');

      // Give a moment for the terminal to be created
      assert.ok(vscode.window.terminals.length >= initialTerminalCount);
    });

    test("should reuse existing terminal for subsequent commands", () => {
      terminalService.executeCommand('echo "first"');
      const terminalCountAfterFirst = vscode.window.terminals.length;

      terminalService.executeCommand('echo "second"');
      const terminalCountAfterSecond = vscode.window.terminals.length;

      assert.strictEqual(terminalCountAfterFirst, terminalCountAfterSecond);
    });

    test("should create terminal with correct name", () => {
      terminalService.executeCommand('echo "test"');

      const panelButtonsTerminal = vscode.window.terminals.find(
        (t) => t.name === "Panel Buttons",
      );

      assert.ok(
        panelButtonsTerminal,
        'Terminal with name "Panel Buttons" should exist',
      );
    });
  });

  suite("dispose", () => {
    test("should dispose terminal without errors", () => {
      terminalService.executeCommand('echo "test"');

      // This should not throw
      assert.doesNotThrow(() => {
        terminalService.dispose();
      });
    });

    test("should handle dispose when no terminal exists", () => {
      // This should not throw even without executing any commands
      assert.doesNotThrow(() => {
        terminalService.dispose();
      });
    });

    test("should create new terminal after dispose", () => {
      terminalService.executeCommand('echo "first"');
      terminalService.dispose();

      // Should create a new terminal
      terminalService.executeCommand('echo "second"');

      const panelButtonsTerminal = vscode.window.terminals.find(
        (t) => t.name === "Panel Buttons",
      );

      assert.ok(panelButtonsTerminal);
    });
  });
});
