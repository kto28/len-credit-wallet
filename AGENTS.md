# Project Rules

## Business Rules — LEN Credit Wallet 回贈制度

### 會籍 Tier 制度

| Tier | 年份 | 回贈率 | 回贈總額 | 會友實收 | Chapter Admin (Wisdom) |
|------|------|--------|---------|---------|----------------------|
| 銀卡 Silver | 第1年續會 | 5% | $240 | $192 | $48 |
| 金卡 Gold | 第2年續會 | 7% | $336 | $288 | $48 |
| 白金 Platinum | 第3年續會+ | 10% | $480 | $432 | $48 |

- **年費**：HKD $4,800
- **拆帳方式**：直接拆帳 — 續會時系統自動拆，會友只看到實收金額
- **Chapter Admin 撥款**：每次續會固定 $48 撥入 Wisdom 帳戶作營運經費
- **現階段**：第一年，所有會友續期為銀卡 (Silver) 開始
- **升級規則**：按連續續會年份自動升級 tier

### 帳戶類型

| 帳戶 | 用途 |
|------|------|
| 會友帳戶 (Member) | 個人 LEN Credit 錢包 |
| Chapter Admin (Wisdom) | 營運經費，由每次續會的 $48 累積 |

### OTP 登入流程

1. 用戶輸入 Mobile + Email
2. 系統發 6 位數 OTP 到 Email（透過 Brevo）
3. OTP 有效期 5 分鐘
4. 驗證成功後建立 7 天 session

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
