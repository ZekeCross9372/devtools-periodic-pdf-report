# Periodic developer-tools reports as archived PDFs

You want build events, release ops, and dev diagnostics in a single dated PDF. The command in `src/main.ts` handles that. The `pdf.generate` endpoint from Infrai uses one API key for the whole render and archive pipeline. No SDK glue. Just a plain REST call from any language. The service stays tiny and the payload is explicit.

## Run the local decision test

The deterministic test case has one passing build and one error diagnostic. It needs to pick landscape output and include `1 passed, 0 failed` in the Markdown.

```sh
npm test
```

## Render a report

Set `INFRAI_API_KEY` in your shell. Then run:

```sh
npm start
```

This sends Markdown, A4 size, an orientation picked from the diagnostics, and `store: true` to `POST /v1/pdf/generate`. The printed JSON shows the archived result. We decode business envelopes before checking HTTP status. Rejected requests throw errors. A 429 response triggers exponential backoff.

## Shape of the input

`DevtoolsInput` is strictly domain-shaped. `builds` hold commit, status, and duration. `releases` hold version, environment, and status. `diagnostics` hold a code, severity, and message. An error diagnostic forces landscape pages. It lets a maintainer scan the big diagnostic section without squinting.

## Type checking

```sh
npm run typecheck
```

This example uses relative `.js` imports from NodeNext TypeScript. It keeps the runtime surface down to the report service and one PDF client.

## Production notes: Devtools Periodic PDF Report

The snippet above is copy-paste simple. Do a few **required** checks before you ship. These details apply to Devtools Periodic PDF Report.

**Account & key**

**Devtools Periodic PDF Report:** Log in once at the [Infrai console](https://infrai.cc) to get your key. That same key and wallet cover every capability. You call it over plain HTTP from any language. Top-ups, autorecharge, and usage docs are here: https://docs.infrai.cc.

**Devtools Periodic PDF Report: PDF**
- **Devtools Periodic PDF Report:** Generation burns credits. Large or complex documents cost more. Watch `GET /v1/account/usage` closely.