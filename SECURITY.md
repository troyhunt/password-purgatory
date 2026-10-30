# Security

Do not submit real passwords or sensitive personal information to Password Purgatory.
The logger stores submitted password attempts, and results are accessible to anyone with the session URL.
Treat session URLs as sensitive until their contents have been reviewed for publication.

For suspected vulnerabilities, contact the maintainer privately through [Troy Hunt's contact page](https://www.troyhunt.com/contact/).
Do not post credentials, session URLs, personal data, or sensitive exploit details in public issues.
Use synthetic examples when describing a problem.

Keep local secrets in ignored `.dev.vars` files and production secrets in Cloudflare.
The repository consolidation is not a security audit or a change to the application's existing data-handling behavior.
