# Panel Buttons

A VS Code extension that adds a customizable panel in the sidebar with buttons to execute terminal commands. Perfect for frequently used commands, build scripts, and project-specific workflows.

## Features

- **Sidebar Panel**: A dedicated panel in the activity bar for quick access to your buttons
- **Configurable Buttons**: Define buttons with custom titles, icons, and terminal commands
- **Auto-Sections**: Buttons with the same `section` property are automatically grouped together
- **User & Workspace Settings**: Configure buttons at the user level (global) or workspace level (project-specific)
- **Settings Merging**: User and workspace settings are intelligently merged, allowing you to have common buttons plus project-specific ones

## Configuration

Configure the extension via VS Code settings (`settings.json`). You can use User Settings for global buttons or Workspace Settings for project-specific buttons.

### Settings

#### `panelButtons.buttons`

Define buttons to display in the panel. Each button has:

| Property  | Type   | Required | Description                                        |
| --------- | ------ | -------- | -------------------------------------------------- |
| `title`   | string | Yes      | Display title for the button                       |
| `command` | string | Yes      | Terminal command to execute when clicked           |
| `section` | string | No       | Section name to group this button under            |
| `icon`    | string | No       | VS Code codicon name (e.g., `play`, `debug-start`) |
| `tooltip` | string | No       | Tooltip text shown on hover                        |

### Example Configuration

```json
{
  "panelButtons.buttons": [
    {
      "section": "Build",
      "title": "Install Dependencies",
      "command": "npm install",
      "icon": "cloud-download",
      "tooltip": "Install all npm dependencies"
    },
    {
      "section": "Build",
      "title": "Build",
      "command": "npm run build",
      "icon": "package"
    },
    {
      "section": "Testing",
      "title": "Run Tests",
      "command": "npm test",
      "icon": "play"
    },
    {
      "section": "Testing",
      "title": "Test (Watch)",
      "command": "npm run test:watch",
      "icon": "eye"
    },
    {
      "section": "Git",
      "title": "Git Status",
      "command": "git status",
      "icon": "git-branch",
      "tooltip": "Show git status"
    }
  ]
}
```

Buttons with the same `section` value are automatically grouped together. Buttons without a `section` appear at the root level.

### User vs Workspace Settings

- **User Settings**: Available in all workspaces. Great for common commands you use everywhere.
- **Workspace Settings**: Specific to a project. Perfect for project-specific build commands.

When both are configured, they are merged:

- Buttons from both sources are combined
- If a button has the same `title` AND `command` in both, the workspace version takes precedence

## Commands

| Command                  | Description                                        |
| ------------------------ | -------------------------------------------------- |
| `Panel Buttons: Refresh` | Refresh the panel to reflect configuration changes |

## Icons

This extension uses VS Code's built-in [codicons](https://code.visualstudio.com/api/references/icons-in-labels). Common icons include:

- `play`, `debug-start`, `debug-stop`
- `package`, `folder`, `file`
- `gear`, `tools`, `wrench`
- `beaker`, `bug`, `check`
- `terminal`, `console`
- `cloud-download`, `cloud-upload`
- `git-branch`, `git-commit`, `git-merge`

## Known Issues

None at this time.

## Release Notes

### 0.1.0

Initial release:

- Sidebar panel with configurable buttons
- Section grouping support
- User and workspace settings merging
- Terminal command execution
