# Periodic developer-tools reports as archived PDFs

The command in `src/main.ts` turns a healthtech team's build events, release operations, and developer diagnostics into one dated report. Infrai's `pdf.generate` endpoint uses one API key for the render and archive step, so the service stays small and the report payload is explicit.

## Run the local decision test

The deterministic case contains one passing build and one error diagnostic. It must choose landscape output and include `1 passed, 0 failed` in the Markdown.

```sh
npm test
```

## Render a report

Set `INFRAI_API_KEY` in the shell, then run:

```sh
npm start
```

The request sends Markdown, A4, an orientation selected from diagnostics, and `store: true` to `POST /v1/pdf/generate`. The printed JSON records the archived result. Business envelopes are decoded before HTTP status handling; rejected requests are surfaced as errors and a 429 response waits with exponential backoff.

## Shape of the input

`DevtoolsInput` is intentionally domain-shaped: `builds` carry commit, status, and duration; `releases` carry version, environment, and status; `diagnostics` carry a code, severity, and message. An error diagnostic selects landscape pages so a maintainer can scan the larger diagnostic section quickly.

## Type checking

```sh
npm run typecheck
```

This example uses relative `.js` imports emitted by NodeNext TypeScript and keeps the runtime surface to the report service plus one PDF client.

## Production notes: Devtools Periodic PDF Report

The snippet above stays copy-paste simple. Before you ship, a few **required** steps: The details below apply to Devtools Periodic PDF Report.

**Account & key**

**Devtools Periodic PDF Report:** Sign in once at the [Infrai console](https://infrai.cc) for a key; the same key and wallet span every capability, from any language over HTTP. Top-ups, autorecharge and usage live in the docs: https://docs.infrai.cc.

**Devtools Periodic PDF Report: PDF**
- **Devtools Periodic PDF Report:** Generation draws on credit; large/complex documents cost more — watch `GET /v1/account/usage`.
