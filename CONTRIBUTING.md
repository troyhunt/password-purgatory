# Contributing

Use `troyhunt/password-purgatory` for new issues and pull requests covering any component.
For an existing issue or pull request in a former repository, link to it so the original discussion and attribution remain discoverable.

## Setup

Install Node.js 24, then run `npm ci` from the repository root.
The npm workspaces share a root lockfile and tool installation.
Do not create component-level lockfiles or commit `node_modules`, `.wrangler`, `.dev.vars`, or `.env` files.
The [component READMEs](README.md#repository-layout) describe local commands.

Use npm's workspace flag when changing a component dependency, for example:

```shell
npm install <package> --workspace password-purgatory-logger
```

Commit both the relevant manifest and the root `package-lock.json`.
Keep shared development tools in the root manifest.

## Making changes

Keep changes focused and preserve the public API, embeddable script paths, and logger session format unless a change explicitly calls for a migration.
Password criteria belong in `apps/api/index.js`.
Browser-only behaviors belong in `apps/web`, not the password rules API.
Logging, notification, and results-page changes belong in `apps/logger`.

The API deliberately rejects every password.
Contradictory or impossible requirements may be intentional; discuss changes to that behavior before removing them.

Run these commands before opening a pull request:

```shell
npm run check
npm run build
```

The current checks cover syntax and Worker bundling, not full behavior.
For behavior changes, add focused automated tests and describe any relevant manual checks in the pull request.
Never use real passwords, production session keys, or production KV data in tests.

The Workers retain their existing Prettier 1.19.1 formatting configuration.
`npm run format` formats both Worker workspaces.
Avoid unrelated formatting churn; for a small change, format only the files you touched.
Keep documentation prose broken at sentence or clause boundaries rather than a fixed line length.

## Deployment and contributions

Pull requests do not receive production deployment credentials.
Deployments are managed separately for the website, API, and logger.
Follow the [migration and deployment guide](docs/repository-migration.md) before enabling production workflows.

Preserve existing copyright and license notices.
There is not yet a project-wide license covering the previously unlicensed website.
Follow the [code of conduct](CODE_OF_CONDUCT.md), and report sensitive issues using the [security guidance](SECURITY.md) rather than a public issue.
