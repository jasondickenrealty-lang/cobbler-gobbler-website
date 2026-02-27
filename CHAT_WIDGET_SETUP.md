# Website Chat Widget (Customer Service)

> Deployment note: this file is maintained for the CobbleStone team’s Vercel deploy pipeline.

This adds a floating chat widget to the CobbleStone Creamery website.

## Architecture (secure)

Browsers never talk to OpenClaw directly.

Browser → Next.js API route → Support Relay (VPS) → OpenClaw agent (`customer-service`).

## Vercel env vars

Set these in Vercel project settings:

- `SUPPORT_RELAY_URL` = `https://<your-domain-or-ip>` (the base URL of the VPS relay)
- `SUPPORT_RELAY_TOKEN` = a long random string

## VPS setup (support relay)

1) Install deps:

```bash
cd /root/CobbleStone-Pos/support-relay
npm i
```

2) Set env vars for the service (example):

```bash
export SUPPORT_RELAY_TOKEN="<same as Vercel>"
export OPENCLAW_AGENT_ID="customer-service"
export PORT=3010
export BIND=127.0.0.1
```

3) Run:

```bash
npm start
```

Then verify:

```bash
curl -s http://127.0.0.1:3010/health
```

## Exposing the relay

Recommended: expose via HTTPS and rate-limit.
Options:
- Caddy or nginx reverse proxy
- Tailscale Serve (private)
- Cloudflare Tunnel

Do NOT expose OpenClaw gateway tokens to the browser.
