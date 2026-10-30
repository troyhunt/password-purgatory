# Website

This directory is the static Cloudflare Pages site and contains the browser scripts used by external consumers.
It has no compilation step.

From the repository root:

```shell
npm ci
npm run dev:web
```

Open `http://localhost:8788`.
The HTML loads assets relative to the site root, so moving these files into this directory does not change their deployed URLs.

## API connections

`make-hell.js` still calls `https://api.passwordpurgatory.com/make-hell`.
`log-hell.js` defaults to the same API host for `/log-hell`, with an optional global `loggerDomain` override declared before the script loads.
The website also loads `log-hell.js`, preserving the pre-migration local edit.
Logging requires a `kvKey` query parameter created by the logger.

Running the website locally does not redirect either script to a local Worker.
For isolated UI development, temporarily point the API URL and logger override at the local Workers, use synthetic input, and do not commit those temporary endpoint changes.
Do not use production session keys.
The migration intentionally leaves existing endpoint behavior unchanged.

## Pages configuration

Use the existing Pages project connected to `troyhunt/password-purgatory`.
Set the root directory to the repository root, leave the build command empty, and set the build output directory to `apps/web`.
Review build watch paths and preview settings before merging the reorganisation.

The repository variable that gates Worker deployments does not gate Pages deployments.
See the [cutover guide](../../docs/repository-migration.md) before changing production settings.
