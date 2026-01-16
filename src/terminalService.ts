import * as vscode from "vscode";

/**
 * Service to manage terminal operations.
 */
export class TerminalService {
  private terminal: vscode.Terminal | undefined;
  private readonly terminalName = "Panel Buttons";

  /**
   * Execute a command in the terminal.
   * Creates a new terminal if one doesn't exist or the existing one was closed.
   */
  executeCommand(command: string): void {
    this.ensureTerminal();

    if (this.terminal) {
      this.terminal.show();
      this.terminal.sendText(command);
    }
  }

  /**
   * Ensure we have a valid terminal instance.
   */
  private ensureTerminal(): void {
    // Check if terminal still exists
    if (this.terminal) {
      const terminalExists = vscode.window.terminals.includes(this.terminal);
      if (!terminalExists) {
        this.terminal = undefined;
      }
    }

    // Create new terminal if needed
    if (!this.terminal) {
      this.terminal = vscode.window.createTerminal({
        name: this.terminalName,
      });
    }
  }

  /**
   * Dispose of the terminal.
   */
  dispose(): void {
    if (this.terminal) {
      this.terminal.dispose();
      this.terminal = undefined;
    }
  }
}
