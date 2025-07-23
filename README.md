# The Sufficient Explorer | al-Kafi Explorer


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## API

Search requests can be made to `/api/search`:

```
GET /api/search?q=prayer&volume=1
```

Returns JSON array of matching hadith objects.

## Credit

- My brother Ali for 'putting me on' to react and github copilot

- Mr Peace for not catching me make this in his class instead of revising

- Claude 3.5 Sonnet THE GOAT (openai sucks)

- [MohammedArab1](https://github.com/MohammedArab1) with his [ThaqalaynAPI](https://github.com/MohammedArab1/ThaqalaynAPI) for his jsons of al-kafi volumes 1-8 with gradings and thaqalayn links which saved me time scraping text, links and gradings myself, instead i just sanitised his data to suit my needs.
