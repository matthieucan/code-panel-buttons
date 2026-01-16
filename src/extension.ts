import * as vscode from "vscode";
import { ConfigurationService } from "./configurationService";
import { TerminalService } from "./terminalService";
import { ButtonsTreeDataProvider } from "./treeDataProvider";
import { Button } from "./models";

export function activate(context: vscode.ExtensionContext) {
  console.log("Panel Buttons extension is now active");

  // Create services
  const configService = new ConfigurationService();
  const terminalService = new TerminalService();
  const treeDataProvider = new ButtonsTreeDataProvider(configService);

  // Register the tree data provider
  const treeView = vscode.window.createTreeView("panelButtonsView", {
    treeDataProvider: treeDataProvider,
    showCollapseAll: true,
  });

  // Register command to execute terminal commands
  const executeCommand = vscode.commands.registerCommand(
    "panel-buttons.executeCommand",
    (button: Button) => {
      if (button && button.command) {
        terminalService.executeCommand(button.command);
      }
    },
  );

  // Register refresh command
  const refreshCommand = vscode.commands.registerCommand(
    "panel-buttons.refresh",
    () => {
      treeDataProvider.refresh();
    },
  );

  // Listen for configuration changes
  const configChangeDisposable = configService.onConfigurationChange(() => {
    treeDataProvider.refresh();
  });

  // Add disposables to context
  context.subscriptions.push(
    treeView,
    executeCommand,
    refreshCommand,
    configChangeDisposable,
    { dispose: () => terminalService.dispose() },
    { dispose: () => treeDataProvider.dispose() },
  );
}

export function deactivate() {}
