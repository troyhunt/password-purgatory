# Repository consolidation

## Scope and provenance

`troyhunt/password-purgatory` is the canonical repository for the website, password rules API, and logger.
The services remain separate Cloudflare deployments.
This migration does not change API URLs, browser script URLs, Worker names, compatibility dates, logger session keys, or KV data formats.

| Source repository                    | Imported upstream commit                   | Destination   |
| ------------------------------------ | ------------------------------------------ | ------------- |
| `troyhunt/password-purgatory`        | `39c861f5e34cdcc9d9edd341b82779750702b368` | `apps/web`    |
| `troyhunt/password-purgatory-api`    | `d44e01392265aae1cd1d734f0795f806207d1911` | `apps/api`    |
| `troyhunt/password-purgatory-logger` | `21ac14342bfa90e111edbb5fa0db17e831b6cc76` | `apps/logger` |

The Worker repositories were imported using non-squashed Git subtree merges, then moved into `apps`.
Their original commits and authors remain reachable from the migration branch.
The original repository URLs remain useful for old issue and pull request discussions.
Do not squash-merge or rebase-merge the migration pull request: use a merge commit to retain the imported histories.
Reviewers should inspect the migration's tree diff as well as its commit list, which includes the imported histories.

Two sets of pre-existing local changes were retained:

- The website loads `log-hell.js` from `index.html`.
- The logger retains its `html-entities` import and dependency, plus the local whitespace change.

Newer upstream changes, including logger HTML escaping and configurable logger domains, were retained too.
Local secret files and `node_modules` were not imported.
Original sibling working directories were left in place.

## Tooling changes

There is one npm workspace installation and one root `package-lock.json`.
Node.js 24 is selected by `.node-version`.
Wrangler is pinned at the root for both local development and CI.
The API's obsolete `type` and empty legacy routing/account fields were replaced with a `main` entry point.
Worker compatibility dates were deliberately not advanced.
Prettier remains at the previously locked version, 1.19.1; this is not a repository-wide reformat.

The root `Checks` workflow performs JavaScript syntax checks and Worker dry-run builds.
It requires no Cloudflare credentials and runs on pull requests and pushes to `main`.
The two legacy nested deployment workflows were replaced by independent root-level workflows.

## Before merging

- [ ] Preserve the migration branch's history with a merge commit, not a squash or rebase merge.
- [ ] Review the carried-over local changes and the root lockfile.
- [ ] Run `npm ci`, `npm run check`, and `npm run build`.
- [ ] Inventory the live Pages project, Worker routes/custom domains, KV bindings, and Worker secrets in Cloudflare.
- [ ] Record the currently deployed versions and a rollback plan.
- [ ] Pause or otherwise coordinate Pages automatic production deployment before merging the directory move.
- [ ] Leave the repository variable `ENABLE_PRODUCTION_DEPLOYS` unset or set to `false` until Worker cutover is approved.

The checked-in configuration does not fully describe production routing.
Do not infer that missing route declarations mean production routes should be removed.
Compare Wrangler's deployment behavior with the dashboard configuration and explicitly preserve existing routes before deploying.

## Cloudflare Pages cutover

Keep the existing Pages project, domain, and GitHub repository connection.
Update its build settings for the new layout:

| Setting                | Value                        |
| ---------------------- | ---------------------------- |
| Production branch      | `main`                       |
| Root directory         | Repository root              |
| Build command          | Empty; the website is static |
| Build output directory | `apps/web`                   |

Review build watch paths so website changes trigger a build.
If the Pages configuration installs dependencies, changes to root `package.json`, `package-lock.json`, and `.node-version` must also be considered.
Use a migration-branch preview or an equivalent controlled preview before changing the production branch's settings.
Do not apply the new output path to the old production tree and allow an automatic build to run.

After the coordinated merge and settings change, verify the homepage, CSS, images, favicon, `/make-hell.js`, and `/log-hell.js`.
Existing embedded script URLs must remain unchanged.
The GitHub variable gating Worker deployments does not disable Pages Git integration.

## Worker deployment cutover

The workflows deploy only from `main` and only when the **repository-level** Actions variable `ENABLE_PRODUCTION_DEPLOYS` equals `true`.
This gate also applies to manual workflow dispatch.
Do not define the gate solely on an environment: it is evaluated before the deployment job starts.

Create these GitHub environments in the canonical repository:

| Workflow        | Environment         | Worker                      |
| --------------- | ------------------- | --------------------------- |
| `Deploy API`    | `production-api`    | `password-purgatory-api`    |
| `Deploy logger` | `production-logger` | `password-purgatory-logger` |

Restrict the environments to `main` and configure approval rules as appropriate.
Set `CF_API_TOKEN` and `CF_ACCOUNT_ID` as environment secrets for each deployment.
Use least-privilege tokens for the intended account and Worker operations.
Secrets from the original repositories do not transfer with Git history.
The workflows map those secret names to Wrangler's `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` environment variables.
The legacy `CF_ZONE_ID` secret is not consumed by these workflows.

Verify the existing logger's `PASSWORD_PURGATORY` binding and keep the current production namespace and data.
Do not create a replacement namespace as part of this move.
Verify that `HELL_API_KEY`, sender/recipient configuration, and any `LOGGER_DOMAIN` override remain configured on the existing Worker.
Runtime secrets live in Cloudflare; they are not supplied by the deployment workflow.
Non-secret dashboard variables must also be accounted for explicitly before deployment because Wrangler may replace dashboard-managed configuration.

Disable the old repositories' deployment workflows before enabling the new ones, so there is only one deployment source per Worker.
Once the routing, bindings, secrets, and preview checks are complete, enable the repository variable and manually dispatch each workflow on `main` for the first controlled deployment.
Subsequent matching pushes deploy only the affected Worker; root dependency/toolchain changes trigger both.
Deployment jobs perform their component's syntax check and dry-run build before deploying.

Verify existing consumers, CORS behavior, session creation, synthetic attempt logging, notification delivery, and results pages without exposing real credentials or personal data.
The existing email integration needs its own availability/configuration review; repository consolidation does not modernise it.

## Public repository administration

These are deliberate follow-up operations, not effects of the local reorganisation:

- [ ] Transfer relevant open issues from the API repository into the canonical repository, preserving discussion.
- [ ] Review the three API pull requests that were open at migration time: #11, #17, and #18.
- [ ] Resolve or carry those contributions forward with author attribution and links to the original discussions; Git does not transfer PR metadata.
- [ ] Add prominent migration notices to both former repositories before archiving them.
- [ ] Remove or disable their deployment credentials/workflows once rollback no longer needs them.
- [ ] Archive, rather than delete, the old repositories after successful cutover.
- [ ] Update repository descriptions, homepage links, branch protections, and the required `Check and build` status check.
- [ ] Clarify the website/project-wide license while retaining all inherited notices.

Stars, forks, issues, and pull requests do not combine merely because histories are merged.
Keeping the existing `password-purgatory` repository preserves its own stars, forks, issues, and public URL.
Historical links into the other repositories should remain accessible.

## Rollback

Before deploying, record the existing Pages deployment and both Worker versions.
If a cutover fails, disable `ENABLE_PRODUCTION_DEPLOYS` and pause Pages automatic deployment.
Roll back the affected service to its recorded deployment/version using Cloudflare's controls.
Restore the old Pages output settings only when deploying the old website tree.
Keep the existing KV namespace and secrets; no data migration or deletion is required.
Avoid enabling old and new deployment sources concurrently.
