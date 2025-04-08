# @kortoaus/cf-ddns

A minimal Cloudflare DDNS (Dynamic DNS) updater written in TypeScript using native `fetch` and zero dependencies (except dotenv).  
Designed to run as a single execution task via CLI or Docker for maximum portability and efficiency.

---

## ✨ Features

- 🔁 Public IP detection using `https://api.ipify.org`
- 🌐 Cloudflare A record auto-updater
- ⚡ Super lightweight (no axios, no cron dependencies)
- 🐳 Docker-friendly
- 🔒 `.env` driven config
- 🧠 Perfect for cron jobs, CI, or lightweight server automation

---

## 🚀 Quick Start

### 1. Install

```bash
npm install -g @kortoaus/cf-ddns
```

Or clone and run locally:

```bash
git clone https://github.com/kortoaus/cf-ddns.git
cd cf-ddns
npm install
npm run build
npm run ddns
```

---

### 2. Environment Setup

Create a `.env` file in the root directory with the following:

```env
CF_API_TOKEN=your_cloudflare_api_token
CF_ZONE_ID=your_zone_id
CF_RECORD_ID=your_dns_record_id
CF_RECORD_NAME=home.example.com
```

---

## 🛠 Usage

```bash
# run once
node dist/index.js

# or with npm script
npm run ddns

# or from cron
*/5 * * * * docker run --rm --env-file ~/.cf-ddns.env ghcr.io/kortoaus/cf-ddns:latest
```

---

## 🐳 Docker Example

```Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --production && npm run build
CMD ["node", "dist/index.js"]
```

---

## 📦 Package Details

- Main: `dist/index.js`
- Type: `module` (ESM)
- CLI-ready: just add a shebang + bin in package.json if needed
- Compatible with Node.js >= 18

---

## 📄 License

MIT © kortoaus