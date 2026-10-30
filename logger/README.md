# 👷 `worker-template` Hello World

A template for kick starting a Cloudflare worker project.

[`index.js`](https://github.com/cloudflare/worker-template/blob/master/index.js) is the content of the Workers script.

#### Wrangler

To generate using [wrangler](https://github.com/cloudflare/wrangler)

```
wrangler generate projectname https://github.com/cloudflare/worker-template
```

Further documentation for Wrangler can be found [here](https://developers.cloudflare.com/workers/tooling/wrangler).

#### Configuration

Make sure environments are configured locally by adding a .dev.vars file as described in [the Wrangler configuration docs](https://developers.cloudflare.com/workers/wrangler/configuration/#local-environments). The vars should include:

```
HELL_API_KEY = ""
FROM_EMAIL = ""
FROM_EMAIL_NAME = ""
TO_EMAIL = ""
TO_EMAIL_NAME = ""
LOGGER_DOMAIN = ""
```
