# The Sufficient Explorer | al-Kafi Explorer


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Architecture

The main UI lives in `app/page.tsx` and contains:

- **Search controls** – volume dropdown, grade filters and search input.
- **Result list** – renders each hadith with highlighting and grading tag.
- **Theme toggle** – switches between light and dark mode and persists the choice.

Server side search is handled by `/app/api/search/route.ts` which loads the JSON data and performs fuzzy matching using Fuse.js.

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

## API usage

Search requests can be made to `/api/search` with the following query params:

`q` – search string (required)

`volume` – volume number (ignored if `all=true`)

`all` – set to `true` to search across all volumes

`grade` – repeated parameter to filter by grading (`sahih`, `good`, `weak`, `unknown`)

Example:

```
/api/search?q=prayer&all=true&grade=sahih&grade=good
```

## Testing

Run linting and Cypress tests:

```bash
npm run lint
npx cypress run
```

## Credit

- My brother Ali for 'putting me on' to react and github copilot

- Mr Peace for not catching me make this in his class instead of revising

- Claude 3.5 Sonnet THE GOAT (openai sucks)

- [MohammedArab1](https://github.com/MohammedArab1) with his [ThaqalaynAPI](https://github.com/MohammedArab1/ThaqalaynAPI) for his jsons of al-kafi volumes 1-8 with gradings and thaqalayn links which saved me time scraping text, links and gradings myself, instead i just sanitised his data to suit my needs.
