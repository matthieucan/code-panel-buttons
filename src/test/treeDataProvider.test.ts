import * as assert from "assert";
import * as vscode from "vscode";
import {
  ButtonsTreeDataProvider,
  SectionTreeItem,
  ButtonTreeItem,
} from "../treeDataProvider";
import { ConfigurationService } from "../configurationService";
import { Button, PanelButtonsConfig } from "../models";

/**
 * Mock ConfigurationService for testing
 */
class MockConfigurationService extends ConfigurationService {
  private mockConfig: PanelButtonsConfig = { buttons: [] };

  setMockConfig(config: PanelButtonsConfig): void {
    this.mockConfig = config;
  }

  override getConfig(): PanelButtonsConfig {
    return this.mockConfig;
  }
}

suite("TreeDataProvider Test Suite", () => {
  let mockConfigService: MockConfigurationService;
  let treeDataProvider: ButtonsTreeDataProvider;

  setup(() => {
    mockConfigService = new MockConfigurationService();
    treeDataProvider = new ButtonsTreeDataProvider(mockConfigService);
  });

  teardown(() => {
    treeDataProvider.dispose();
  });

  suite("getChildren - Root Level", () => {
    test("should return empty array when no buttons configured", () => {
      mockConfigService.setMockConfig({ buttons: [] });

      const children = treeDataProvider.getChildren();
      assert.strictEqual(children.length, 0);
    });

    test("should return sections at root level when buttons have section property", () => {
      const buttons: Button[] = [
        { title: "Button 1", command: "cmd1", section: "Section 1" },
        { title: "Button 2", command: "cmd2", section: "Section 2" },
      ];
      mockConfigService.setMockConfig({ buttons });

      const children = treeDataProvider.getChildren();
      assert.strictEqual(children.length, 2);
      assert.ok(children[0] instanceof SectionTreeItem);
      assert.ok(children[1] instanceof SectionTreeItem);
    });

    test("should return ungrouped buttons at root level", () => {
      const buttons: Button[] = [
        { title: "Button 1", command: "cmd1" },
        { title: "Button 2", command: "cmd2" },
      ];
      mockConfigService.setMockConfig({ buttons });

      const children = treeDataProvider.getChildren();
      assert.strictEqual(children.length, 2);
      assert.ok(children[0] instanceof ButtonTreeItem);
      assert.ok(children[1] instanceof ButtonTreeItem);
    });

    test("should return both sections and ungrouped buttons at root level", () => {
      const buttons: Button[] = [
        { title: "Grouped Button", command: "cmd1", section: "Build" },
        { title: "Ungrouped Button", command: "cmd2" },
      ];
      mockConfigService.setMockConfig({ buttons });

      const children = treeDataProvider.getChildren();
      assert.strictEqual(children.length, 2); // 1 section + 1 ungrouped button
    });

    test("should group buttons with same section name", () => {
      const buttons: Button[] = [
        { title: "Button 1", command: "cmd1", section: "Build" },
        { title: "Button 2", command: "cmd2", section: "Build" },
        { title: "Button 3", command: "cmd3", section: "Test" },
      ];
      mockConfigService.setMockConfig({ buttons });

      const children = treeDataProvider.getChildren();
      assert.strictEqual(children.length, 2); // 2 sections

      const buildSection = children[0] as SectionTreeItem;
      assert.strictEqual(buildSection.sectionName, "Build");
      assert.strictEqual(buildSection.buttons.length, 2);
    });

    test("should preserve section order based on first appearance", () => {
      const buttons: Button[] = [
        { title: "Button 1", command: "cmd1", section: "First" },
        { title: "Button 2", command: "cmd2", section: "Second" },
        { title: "Button 3", command: "cmd3", section: "First" },
      ];
      mockConfigService.setMockConfig({ buttons });

      const children = treeDataProvider.getChildren();
      assert.strictEqual((children[0] as SectionTreeItem).sectionName, "First");
      assert.strictEqual(
        (children[1] as SectionTreeItem).sectionName,
        "Second",
      );
    });
  });

  suite("getChildren - Section Children", () => {
    test("should return buttons belonging to a section", () => {
      const buttons: Button[] = [
        { title: "Button 1", command: "cmd1", section: "Build" },
        { title: "Button 2", command: "cmd2", section: "Build" },
      ];
      mockConfigService.setMockConfig({ buttons });

      const rootChildren = treeDataProvider.getChildren();
      const sectionItem = rootChildren[0] as SectionTreeItem;
      const sectionChildren = treeDataProvider.getChildren(sectionItem);

      assert.strictEqual(sectionChildren.length, 2);
      assert.ok(sectionChildren[0] instanceof ButtonTreeItem);
      assert.ok(sectionChildren[1] instanceof ButtonTreeItem);
    });

    test("should not include buttons from other sections", () => {
      const buttons: Button[] = [
        { title: "Button 1", command: "cmd1", section: "Build" },
        { title: "Button 2", command: "cmd2", section: "Test" },
      ];
      mockConfigService.setMockConfig({ buttons });

      const rootChildren = treeDataProvider.getChildren();
      const buildSection = rootChildren[0] as SectionTreeItem;
      const buildChildren = treeDataProvider.getChildren(buildSection);

      assert.strictEqual(buildChildren.length, 1);
      assert.strictEqual(
        (buildChildren[0] as ButtonTreeItem).button.title,
        "Button 1",
      );
    });
  });

  suite("getChildren - Button Children", () => {
    test("should return empty array for button items", () => {
      const buttons: Button[] = [{ title: "Button 1", command: "cmd1" }];
      mockConfigService.setMockConfig({ buttons });

      const rootChildren = treeDataProvider.getChildren();
      const buttonItem = rootChildren[0] as ButtonTreeItem;
      const buttonChildren = treeDataProvider.getChildren(buttonItem);

      assert.strictEqual(buttonChildren.length, 0);
    });
  });

  suite("getTreeItem", () => {
    test("should return the same item passed in", () => {
      const buttons: Button[] = [
        { title: "Button 1", command: "cmd1", section: "Build" },
      ];
      mockConfigService.setMockConfig({ buttons });

      const rootChildren = treeDataProvider.getChildren();
      const sectionItem = rootChildren[0];
      const treeItem = treeDataProvider.getTreeItem(sectionItem);

      assert.strictEqual(treeItem, sectionItem);
    });
  });

  suite("SectionTreeItem", () => {
    test("should create section item with expanded state", () => {
      const sectionItem = new SectionTreeItem("Test Section", []);

      assert.strictEqual(sectionItem.label, "Test Section");
      assert.strictEqual(
        sectionItem.collapsibleState,
        vscode.TreeItemCollapsibleState.Expanded,
      );
      assert.strictEqual(sectionItem.contextValue, "section");
    });

    test("should have folder icon by default", () => {
      const sectionItem = new SectionTreeItem("Test Section", []);

      assert.ok(sectionItem.iconPath instanceof vscode.ThemeIcon);
      assert.strictEqual(
        (sectionItem.iconPath as vscode.ThemeIcon).id,
        "folder",
      );
    });

    test("should store buttons reference", () => {
      const buttons: Button[] = [{ title: "Button 1", command: "cmd1" }];
      const sectionItem = new SectionTreeItem("Test Section", buttons);

      assert.strictEqual(sectionItem.buttons.length, 1);
      assert.strictEqual(sectionItem.buttons[0].title, "Button 1");
    });
  });

  suite("ButtonTreeItem", () => {
    test("should create button item with correct properties", () => {
      const button: Button = {
        title: "Test Button",
        command: 'echo "test"',
      };
      const buttonItem = new ButtonTreeItem(button);

      assert.strictEqual(buttonItem.label, "Test Button");
      assert.strictEqual(
        buttonItem.collapsibleState,
        vscode.TreeItemCollapsibleState.None,
      );
      assert.strictEqual(buttonItem.contextValue, "button");
      assert.strictEqual(buttonItem.description, 'echo "test"');
    });

    test("should use tooltip when provided", () => {
      const button: Button = {
        title: "Test Button",
        command: 'echo "test"',
        tooltip: "Custom tooltip",
      };
      const buttonItem = new ButtonTreeItem(button);

      assert.strictEqual(buttonItem.tooltip, "Custom tooltip");
    });

    test("should use command as tooltip when tooltip not provided", () => {
      const button: Button = {
        title: "Test Button",
        command: "npm run build",
      };
      const buttonItem = new ButtonTreeItem(button);

      assert.strictEqual(buttonItem.tooltip, "npm run build");
    });

    test("should set icon when provided", () => {
      const button: Button = {
        title: "Test Button",
        command: "cmd",
        icon: "play",
      };
      const buttonItem = new ButtonTreeItem(button);

      assert.ok(buttonItem.iconPath instanceof vscode.ThemeIcon);
      assert.strictEqual((buttonItem.iconPath as vscode.ThemeIcon).id, "play");
    });

    test("should have execute command configured", () => {
      const button: Button = {
        title: "Test Button",
        command: "echo hello",
      };
      const buttonItem = new ButtonTreeItem(button);

      assert.ok(buttonItem.command);
      assert.strictEqual(
        buttonItem.command?.command,
        "panel-buttons.executeCommand",
      );
      assert.deepStrictEqual(buttonItem.command?.arguments, [button]);
    });
  });

  suite("refresh", () => {
    test("should trigger onDidChangeTreeData event", (done) => {
      const disposable = treeDataProvider.onDidChangeTreeData(() => {
        disposable.dispose();
        done();
      });

      treeDataProvider.refresh();
    });
  });
});
