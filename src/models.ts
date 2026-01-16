/**
 * Represents a button that executes a terminal command
 */
export interface Button {
  /** Display title for the button */
  title: string;
  /** Terminal command to execute when clicked */
  command: string;
  /** Section name to group this button under (optional) */
  section?: string;
  /** Optional icon (VS Code codicon name) */
  icon?: string;
  /** Optional tooltip text */
  tooltip?: string;
}

/**
 * Configuration for the panel buttons extension
 */
export interface PanelButtonsConfig {
  buttons: Button[];
}
