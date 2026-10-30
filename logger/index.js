addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const pathname = new URL(request.url).pathname

  // Basic routing for each different entry point
  if (pathname === '/create-hell') {
    return createHell(request)
  } else if (pathname === '/log-hell' && request.method === 'OPTIONS') {
    return optionsHell()
  } else if (pathname === '/log-hell' && request.method === 'POST') {
    return logHell(request)
  } else if (pathname === '/get-hell') {
    return getHell(request)
  }
}

// HTTP POST
async function createHell(request) {
  // Logging requires an API key to ensure the endpoint isn't abused and used to write garbage to KV
  const apiKey = request.headers.get('hell-api-key')
  if (apiKey !== HELL_API_KEY) {
    return new Response('Incorrect API key', { status: 401 })
  }

  // Now that the request is authenticated, create a key, store it in KV and return it so it can be
  // used for future logging. The key will be a GUID.
  const kvKey = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  )

  // There won't be a value yet, that will come later when passwords are logged
  await PASSWORD_PURGATORY.put(kvKey, '')

  const data = {
    kvKey: kvKey,
  }

  const jsonData = JSON.stringify(data)

  return new Response(jsonData, {
    headers: { 'Content-type': 'application/json;charset=UTF-8' },
  })
}

// HTTP OPTIONS
async function optionsHell() {
  return new Response('', {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

// HTTP POST
async function logHell(request) {
  const json = await request.json()
  const kvKey = json.kvKey

  let kvValue = await PASSWORD_PURGATORY.get(kvKey)
  let history = ''

  // The key doesn't exist which means an invalid value has been passed
  if (kvValue === null) {
    const data = {
      message: 'kvKey "' + kvKey + '" doesn\'t exist',
    }

    const jsonData = JSON.stringify(data)

    return new Response(jsonData, {
      headers: { 'Content-type': 'application/json;charset=UTF-8' },
      status: 404,
    })
  }

  const attempt = {
    timestamp: new Date().getTime(),
    criteria: json.criteria,
    password: json.password,
  }

  // The key exists but there's no history yet so this is the first password to be logged
  if (kvValue === '') {
    history = [attempt]

    // Send an email on the first logged password so we know a new spammer is on the hook
    let emailBody = JSON.stringify({
      personalizations: [
        {
          to: [{ email: TO_EMAIL, name: TO_EMAIL_NAME }],
        },
      ],
      from: {
        email: FROM_EMAIL,
        name: FROM_EMAIL_NAME,
      },
      subject: 'New spammer hooked!',
      content: [
        {
          type: 'text/plain',
          value:
            'View the log of their painful password attempts here: ' + (typeof LOGGER_DOMAIN !== 'undefined' ? LOGGER_DOMAIN : "https://passwordpurgatory.com") + '/get-hell?kvKey=' +
            kvKey,
        },
      ],
    })

    await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: emailBody,
    })
  }

  // The key exists and there's already at least one password been logged
  else {
    history = JSON.parse(kvValue)

    // Because I want to share the password attempts publicly, there needs to be a cut-off time; I
    // don't want to look at a bunch of password attempts, conclude they're fine to share publicly
    // then have a *new* entry added that's inappropriate for public consumption, for example
    // because it may contain PII. As such, only attempts within 15 mins of the first one will be
    // recorded.
    if ((new Date().getTime() - history[0].timestamp) / 1000 / 60 < 15) {
      history.push(attempt)
    }
  }

  // Save the history back to KV
  const jsonHistory = JSON.stringify(history)
  await PASSWORD_PURGATORY.put(kvKey, jsonHistory)

  return new Response(jsonHistory, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-type': 'application/json;charset=UTF-8',
    },
  })
}

// HTTP GET
async function getHell(request) {
  const { searchParams } = new URL(request.url)
  let kvKey = searchParams.get('kvKey')
  let history = await PASSWORD_PURGATORY.get(kvKey, { type: 'json' })
  let pageTitle = ''
  let pageDescription = ''
  let pageContents = ''
  let status = 200

  if (history === null) {
    pageTitle = 'Hell Not Found'
    pageDescription = 'No hell with that kvKey exists'
    pageContents = '<h1>' + pageDescription + '</h1>'
    status = 404
  } else {
    // This is mostly to make nice Twitter cards for social sharing. Show the last attempt in the
    // meta description as it'll probably be the funniest 🤣
    pageTitle = 'Password Purgatory - Making Life Hell for Spammers'
    pageDescription =
      escapeHtml(history[history.length - 1].criteria) +
      ': ' +
      escapeHtml(history[history.length - 1].password)
    pageContents =
      '<h1>Spammer made ' +
      history.length +
      ' attempts to create a password that passes crazy criteria</h1><ol>'

    history.forEach(
      (attempt, i) =>
        (pageContents +=
          `<li><h2>Attempt ` +
          (i + 1) +
          (i === 0
            ? ``
            : ` (` +
              Math.round(
                (attempt.timestamp - history[i - 1].timestamp) / 1000,
              ) +
              ` seconds later)`) +
          `</h2>
      <dl><dt>Criteria:</dt> <dd>` +
          (escapeHtml(attempt.criteria) === '' ? '[none]' : escapeHtml(attempt.criteria)) +
          `</dd>
      <dt>Password:</dt> <dd>` +
      escapeHtml(attempt.password) +
          `</dd></dl></li>
      `),
    )

    pageContents +=
      `</ol>
      <p class="spammer-hell-summary">Spammer burned a total of ` +
      Math.round(
        (history[history.length - 1].timestamp - history[0].timestamp) / 1000,
      ) +
      ` seconds in Password Purgatory 😈</p>`
  }

  const html =
    `<!DOCTYPE html>
    <head>
      <title>` +
    pageTitle +
    `</title>
      <meta name=description content="` +
    pageDescription +
    `">
      <meta name=twitter:title content="` +
    pageTitle +
    `">
      <meta name=twitter:image content="https://passwordpurgatory.com/logo-social.jpg">
      <meta name=twitter:description content="` +
    pageDescription +
    `">
      <meta name=twitter:creator content="@troyhunt">
      <meta name=twitter:card content="summary_large_image">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <link href="https://passwordpurgatory.com/make-hell-pretty.css" rel="stylesheet" />
      <link rel="icon" href="https://passwordpurgatory.com/favicon.ico" type="image/png" />
    </head>
    <html>
      <body>` +
    pageContents +
    `<p>A <a href="https://troyhunt.com">troyhunt.com</a> project <a href="https://troyhunt.com/sending-spammers-to-password-purgatory-with-microsoft-power-automate-and-cloudflare-workers-kv">designed to antagonise spammers</a>.</p>
    </body>
    </html>`

  return new Response(html, {
    headers: { 'Content-type': 'text/html;charset=UTF-8' },
    status: status,
  })
}

const htmlEntityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;',
  '/': '&#x2F;',
}

function escapeHtml (str) {
  const r = /[&<>"'`\/]/g
  return str.replace(r, (s) => {
    return htmlEntityMap[s]
  })
}
