# Password rules API

Cloudflare Worker returning deliberately frustrating reasons to reject a password.
The production endpoint is `https://api.passwordpurgatory.com/make-hell`.
Every password is rejected; checks are selected from the lowest available infuriation level.

## Local development

From the repository root:

```shell
npm ci
npm run dev:api
```

The local Worker runs at `http://localhost:8787`.
Request `/make-hell?password=synthetic-example` to receive JSON containing a `message` property.
This Worker does not require the logger, KV, or local secrets.
Always use synthetic input.

```shell
npm run check --workspace password-purgatory-api
npm run build --workspace password-purgatory-api
```

The build is a dry run and does not deploy.
The Worker name and compatibility date are unchanged.
Wrangler configuration now uses `main` instead of the obsolete `type` property.

## Contributions

Keep password criteria implementable in the API.
Blocking paste and other browser behaviors belong in the website or consuming application, not this Worker.
See the root [contribution guide](../../CONTRIBUTING.md).

This component was imported with history from [`troyhunt/password-purgatory-api`](https://github.com/troyhunt/password-purgatory-api).
Existing license files and notices are retained.
Deployment is documented in the [migration guide](../../docs/repository-migration.md).
