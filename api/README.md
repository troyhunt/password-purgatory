# 👷 `worker-template` Hello World

A template for kick starting a Cloudflare worker project.

[`index.js`](https://github.com/cloudflare/worker-template/blob/master/index.js) is the content of the Workers script.

#### Wrangler

To generate using [wrangler](https://github.com/cloudflare/wrangler)

```
wrangler generate projectname https://github.com/cloudflare/worker-template
```

Further documentation for Wrangler can be found [here](https://developers.cloudflare.com/workers/tooling/wrangler).

#### Objectives

Just to keep things focused in terms of the goals of this porject, any password criteria designed to infuriate spammers should be things that can be implemented *in the API*. Ideas around blocking paste or adding infurating anti-automation are admirable, but they need to be implemented client-side on the consuming application rather than in this API.
