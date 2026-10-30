# Password Purgatory

Deliberately making password creation hell.
Password Purgatory rejects passwords with increasingly frustrating criteria.

[Live site](https://passwordpurgatory.com/) |
[Introducing the project](https://www.troyhunt.com/building-password-purgatory-with-cloudflare-pages-and-workers/) |
[Logging password attempts](https://www.troyhunt.com/sending-spammers-to-password-purgatory-with-microsoft-power-automate-and-cloudflare-workers-kv/)

## Repository layout

The website, password API, and logger now share this repository.
They remain independently deployable; consolidation does not change their public URLs or combine their runtimes.

| Directory                    | Responsibility                                                                    | Deployment                                         |
| ---------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------- |
| [`apps/web`](apps/web)       | Static website, styles, images, and embeddable browser scripts                    | Cloudflare Pages                                   |
| [`apps/api`](apps/api)       | Password rules and rejection responses                                            | `password-purgatory-api` Worker                    |
| [`apps/logger`](apps/logger) | Session creation, password attempt logging, notification email, and results pages | `password-purgatory-logger` Worker with Workers KV |

Worker source history and license notices are preserved from the original repositories.
See the [migration guide](docs/repository-migration.md) for provenance, deployment cutover, and outstanding repository administration.

## Getting started

Use Node.js 24 and npm.
Run commands from this repository's root:

```shell
npm ci
npm run check
npm run build
```

`check` checks JavaScript syntax.
`build` bundles both Workers with Wrangler's `--dry-run`; it does not deploy or require Cloudflare credentials.
These are migration checks, not a comprehensive automated behavior test suite.
Wrangler is pinned in the root package manifest and lockfile.

Run whichever component you need in a separate terminal:

```shell
npm run dev:web
npm run dev:api
npm run dev:logger
```

The website runs at `http://localhost:8788`, the API at `http://localhost:8787`, and the logger at `http://localhost:8789`.
See each component's README for configuration and limitations.
In particular, the browser scripts still target the public API by default: starting the local website does **not** connect it to the local Workers.

Use synthetic passwords only.
The logger records submitted passwords and serves results to anyone with the session URL.
Do not enter real credentials or use production session keys for development.

## Development and deployment

- [Contributing](CONTRIBUTING.md): workspace commands, scope, and pull requests.
- [Deployment and migration](docs/repository-migration.md): Pages settings, Worker workflows, secrets, and cutover.
- [Security](SECURITY.md): reporting concerns and safe use.
- [Code of conduct](CODE_OF_CONDUCT.md).

Pull requests run syntax checks and Worker dry-run builds without deployment credentials.
Production Worker deployment is opt-in through the repository variable `ENABLE_PRODUCTION_DEPLOYS`; it is not enabled by this reorganisation.
Cloudflare Pages has separate dashboard-controlled deployment settings.

## Licensing

The API and logger retain their original `LICENSE_MIT` and `LICENSE_APACHE` files and copyright notices in their respective directories.
Their package manifests declare MIT.
The website previously had no license file; this migration does not introduce a blanket license or relicense anyone's contributions.
Clarifying a project-wide license remains a maintainer decision.
