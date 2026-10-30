# Password attempt logger

Cloudflare Worker creating logging sessions, storing attempts in Workers KV, sending a notification on the first attempt, and rendering results pages.

| Endpoint              | Purpose                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------- |
| `/create-hell`        | Create a session using the `hell-api-key` header; returns a `kvKey`                       |
| `/log-hell`           | Accept a JSON POST containing `kvKey`, `criteria`, and `password`; handles CORS preflight |
| `/get-hell?kvKey=...` | Render a session's results as HTML                                                        |

Only attempts within 15 minutes of the first attempt are added to an existing session.
That cutoff is not a KV retention policy: the stored record does not automatically expire.
Results are accessible to anyone with the session URL.
Never use real passwords or sensitive personal data.

## Local development

From the repository root, run `npm ci`.
Copy this directory's `.dev.vars.example` to `.dev.vars` and fill in development-only values.
Do not copy production credentials or commit the resulting file.

```shell
npm run dev:logger
```

The Worker runs at `http://localhost:8789`.
The `--local` development command uses local KV storage under `.wrangler`, not the production namespace.
Secrets are read from this workspace's `.dev.vars`.

| Variable                         | Purpose                                                                  |
| -------------------------------- | ------------------------------------------------------------------------ |
| `HELL_API_KEY`                   | Development API key required to create a session                         |
| `FROM_EMAIL` / `FROM_EMAIL_NAME` | Notification sender                                                      |
| `TO_EMAIL` / `TO_EMAIL_NAME`     | Notification recipient                                                   |
| `LOGGER_DOMAIN`                  | Base URL used in notification links; use `http://localhost:8789` locally |

Local mode does not intercept external HTTP requests.
The first logged attempt still invokes the existing MailChannels integration; its availability and configuration must be reviewed before end-to-end testing or relaunch.
For offline tests, mock outbound email rather than contacting the service.
Generated results pages still reference production website assets.

```shell
npm run check --workspace password-purgatory-logger
npm run build --workspace password-purgatory-logger
```

The build is a dry run and does not deploy.
The Worker name, compatibility date, and KV binding are unchanged.
For your own deployment, provision your own namespace and update the IDs before deploying.
Namespace IDs are identifiers, not credentials.

## Migration notes

This component was imported with history from [`troyhunt/password-purgatory-logger`](https://github.com/troyhunt/password-purgatory-logger).
Existing license files and notices are retained.
The pre-migration local `html-entities` import and dependency are preserved, although the import is currently unused; upstream's `escapeHtml` implementation remains in place.
The old local lockfile is superseded by the root workspace lockfile.

Production secrets are not checked in or copied from the old working directory.
See the [deployment and cutover guide](../../docs/repository-migration.md).
