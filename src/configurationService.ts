import * as vscode from "vscode";
import { Button, PanelButtonsConfig } from "./models";

/**
 * Service to manage configuration for panel buttons.
 * Handles merging of User and Workspace settings.
 */
export class ConfigurationService {
  private static readonly CONFIG_SECTION = "panelButtons";
  private static readonly BUTTONS_KEY = "buttons";

  /**
   * Get the merged configuration from User and Workspace settings.
   * User buttons come first, then workspace buttons are appended.
   */
  getConfig(): PanelButtonsConfig {
    const config = vscode.workspace.getConfiguration(
      ConfigurationService.CONFIG_SECTION,
    );

    const buttonsInspect = config.inspect<Button[]>(
      ConfigurationService.BUTTONS_KEY,
    );

    const buttons = this.mergeButtons(
      buttonsInspect?.globalValue ?? [],
      buttonsInspect?.workspaceValue ?? [],
    );

    return { buttons };
  }

  /**
   * Merge buttons from user and workspace settings.
   * User buttons come first, then workspace buttons are appended.
   * Buttons with same title and command are deduplicated (workspace wins).
   */
  mergeButtons(userButtons: Button[], workspaceButtons: Button[]): Button[] {
    const buttonMap = new Map<string, Button>();

    // Add user buttons first
    for (const button of userButtons) {
      if (button.title && button.command) {
        const key = `${button.title}|${button.command}`;
        buttonMap.set(key, button);
      }
    }

    // Workspace buttons override user buttons with same title+command
    for (const button of workspaceButtons) {
      if (button.title && button.command) {
        const key = `${button.title}|${button.command}`;
        buttonMap.set(key, button);
      }
    }

    return Array.from(buttonMap.values());
  }

  /**
   * Listen for configuration changes.
   */
  onConfigurationChange(callback: () => void): vscode.Disposable {
    return vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(ConfigurationService.CONFIG_SECTION)) {
        callback();
      }
    });
  }
}
