# Project Rules

## Hostinger Server (CRITICAL)
- Host: 151.106.123.229:65002
- This is a PRODUCTION server hosting multiple client websites
- **DO NOT** make frequent SSH connections (max 1-2 per session)
- **DO NOT** run stress tests or bulk operations on this server
- **DO NOT** create multiple SSH tunnels
- If testing is needed, use local environment or a separate dev server
- Always disconnect SSH immediately after use

## Deployment
- Auto-deploys from GitHub (kto28/len-credit-wallet) on push to main
- Environment variables set via hPanel UI
- Hostinger handles standalone build automatically

## Database
- MariaDB 11.8.6 on same server (localhost)
- DB: u448459108_lenwallet
- Use hPanel phpMyAdmin for DB management when possible

## Dev Environment
- Local dev: npm run dev (uses .env.local for MySQL tunnel or mock mode)
- Build test: npm run build (check TypeScript + compilation)
- Always verify build passes before pushing
