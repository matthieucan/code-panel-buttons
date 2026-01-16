# Building Panel Buttons

Follow these steps to build, test, and publish the Panel Buttons VS Code extension.

## Prerequisites
- Node.js 18+ (Corepack recommended to get the right Yarn version). Use an LTS release (18 or 20) when building binaries—Node 25+ removes APIs that `vsce` still depends on.
- Yarn Classic (1.x) available globally (`corepack enable` or `npm install -g yarn`)
- (Optional) [vsce](https://www.npmjs.com/package/@vscode/vsce) and [ovsx](https://www.npmjs.com/package/ovsx) CLIs for manual packaging/publishing

## Install Dependencies

```bash
yarn install --frozen-lockfile
```

## Build Targets
- **Type-check + lint + bundle (dev):** `yarn compile`
- **Continuous rebuilds while developing:** `yarn watch`
- **Production bundle (minified):** `yarn package`

The bundled output lands in `dist/`.

## Linting & Tests
- **Lint:** `yarn lint`
- **Unit tests:** `yarn test`

## Packaging a VSIX
1. Produce a production bundle: `yarn package`
2. Ensure you are using Node 18/20 (e.g., `nvm use 20`)
3. Create the VSIX: `npx @vscode/vsce package`
   - This writes `panel-buttons-<version>.vsix` to the repo root.

## Publishing to Open VSX
1. Install the CLI (once): `npm install -g ovsx` (or `yarn global add ovsx`)
2. Authenticate: `ovsx login --pat <your-token>`
3. Publish: `ovsx publish panel-buttons-<version>.vsix`

## Continuous Deployment
Whenever a Git tag is pushed, the GitHub Action defined in `.github/workflows/publish-ovsx.yml` installs dependencies with Yarn, runs `yarn package`, builds a VSIX with `npx @vscode/vsce`, and publishes it to Open VSX using `npx ovsx`. Store your Open VSX token in the repository secret `OVSX_PAT` so the workflow can authenticate.

## Troubleshooting
- **`TypeError: Cannot read properties of undefined (reading 'prototype')`** while running `npx @vscode/vsce package`: switch to Node 20 LTS (`nvm use 20` or `volta install node@20`). Node 25 removed `SlowBuffer`, which some transitive `vsce` dependencies still touch.
