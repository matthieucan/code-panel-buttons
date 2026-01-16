import * as vscode from "vscode";
import { Button } from "./models";
import { ConfigurationService } from "./configurationService";

/**
 * Represents an item in the tree view (either a section or a button)
 */
export type TreeItem = SectionTreeItem | ButtonTreeItem;

/**
 * Tree item representing a section (auto-created from button.section property)
 */
export class SectionTreeItem extends vscode.TreeItem {
  constructor(
    public readonly sectionName: string,
    public readonly buttons: Button[],
  ) {
    super(sectionName, vscode.TreeItemCollapsibleState.Expanded);

    this.contextValue = "section";
    this.tooltip = sectionName;
    this.iconPath = new vscode.ThemeIcon("folder");
  }
}

/**
 * Tree item representing a button
 */
export class ButtonTreeItem extends vscode.TreeItem {
  constructor(public readonly button: Button) {
    super(button.title, vscode.TreeItemCollapsibleState.None);

    this.contextValue = "button";
    this.tooltip = button.tooltip ?? button.command;
    this.description = button.command;

    if (button.icon) {
      this.iconPath = new vscode.ThemeIcon(button.icon);
    }

    // Make the item clickable to execute the command
    this.command = {
      command: "panel-buttons.executeCommand",
      title: "Execute Command",
      arguments: [button],
    };
  }
}

/**
 * Tree data provider for the panel buttons view
 */
export class ButtonsTreeDataProvider
  implements vscode.TreeDataProvider<TreeItem>
{
  private _onDidChangeTreeData = new vscode.EventEmitter<
    TreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private configService: ConfigurationService) {}

  /**
   * Refresh the tree view
   */
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  /**
   * Get the tree item for an element
   */
  getTreeItem(element: TreeItem): vscode.TreeItem {
    return element;
  }

  /**
   * Get children of an element (or root elements if no element provided)
   */
  getChildren(element?: TreeItem): TreeItem[] {
    const config = this.configService.getConfig();

    if (!element) {
      // Root level - return sections and ungrouped buttons
      return this.getRootItems(config.buttons);
    }

    if (element instanceof SectionTreeItem) {
      // Return buttons belonging to this section
      return element.buttons.map((button) => new ButtonTreeItem(button));
    }

    return [];
  }

  /**
   * Get root level items (sections derived from buttons, and ungrouped buttons)
   */
  private getRootItems(buttons: Button[]): TreeItem[] {
    const items: TreeItem[] = [];

    // Create a map of section name to buttons (preserving order)
    const sectionButtonsMap = new Map<string, Button[]>();
    const sectionOrder: string[] = [];
    const ungroupedButtons: Button[] = [];

    for (const button of buttons) {
      if (button.section) {
        if (!sectionButtonsMap.has(button.section)) {
          sectionButtonsMap.set(button.section, []);
          sectionOrder.push(button.section);
        }
        sectionButtonsMap.get(button.section)!.push(button);
      } else {
        ungroupedButtons.push(button);
      }
    }

    // Add sections with their buttons (in order of first appearance)
    for (const sectionName of sectionOrder) {
      const sectionButtons = sectionButtonsMap.get(sectionName) ?? [];
      items.push(new SectionTreeItem(sectionName, sectionButtons));
    }

    // Add ungrouped buttons at the root level
    for (const button of ungroupedButtons) {
      items.push(new ButtonTreeItem(button));
    }

    return items;
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    this._onDidChangeTreeData.dispose();
  }
}
