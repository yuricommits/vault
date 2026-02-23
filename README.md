# vault

A personal, web-based code snippet manager with AI enhancement powered by Claude.

## Features

- Save snippets with title, description, and language
- Full-text search across titles and descriptions
- Tag and organize snippets
- Syntax highlighting via Shiki
- One-click copy to clipboard
- AI enhancement — paste raw code, Claude generates title, description, tags, and improved code
- Keyboard shortcuts (N, /, Esc)
- Private by default — auth required

## Tech Stack

- [Next.js](https://nextjs.org) — framework
- [Drizzle ORM](https://orm.drizzle.team) + [Neon](https://neon.tech) — database
- [Auth.js](https://authjs.dev) — authentication
- [Shiki](https://shiki.style) — syntax highlighting
- [Anthropic SDK](https://github.com/anthropic-ai/anthropic-sdk-typescript) — AI enhancement
- Deployed on [Vercel](https://vercel.com)

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yuricommits/vault
cd vault
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```
DATABASE_URL=        # Neon Postgres connection string
AUTH_SECRET=         # Random secret for Auth.js (run: openssl rand -base64 32)
GITHUB_TOKEN=        # GitHub token with repo read access (for changelog)
```

### 4. Push the database schema

```bash
npx drizzle-kit push
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## AI Enhancement

Vault uses the Anthropic API for AI-powered snippet enhancement. Each user brings their own Anthropic API key — add it in **Settings** after signing in. Get a key at [console.anthropic.com](https://console.anthropic.com/settings/keys).

## Contributing

Pull requests are welcome. For major changes, open an issue first.

## License

MIT
