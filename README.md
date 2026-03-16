# Al-Kafi Explorer

Al-Kafi Explorer ("The Sufficient Explorer") is an exploration tool for navigating the classic Arabic book al-Kafi (The Sufficient). This project provides a clean UI, advanced filters, and a searchable interface for Al-Kafi, one of the major Shi'i hadith collections. Originally developed as the foundational step toward the Saadah Library project, it serves as a reliable digital interface for students, researchers, and the curious public.

## What the app provides

- A searchable engine for the entirety of the Al-Kafi collection.
- English translations displayed alongside original Arabic text.
- Advanced filters for efficient research and content exploration.
- Hadith sharing capabilities with gradings, verifiable source references, and links (volumes 1-8).
- Included Python ETL pipeline for sanitizing and transforming source data.

## Who it's for

- Students and researchers of Islamic studies.
- Community members seeking reliable translations and references.
- Developers and data engineers interested in the ETL processing of classical texts.

## Tech stack

- **Framework:** Next.js 15 (App Router) with React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3
- **Icons:** Lucide React
- **Testing:** Cypress
- **Linting:** ESLint 8
- **Package manager:** npm (or yarn / pnpm / bun)

For developers:

1. Fork the repository and open a branch for your changes.
2. Run the app locally (see "Local development") and include tests where appropriate.
3. Open a pull request with a clear description of your changes.

## Local development

Clone the repository, install dependencies, and run the development server:

```bash
git clone https://github.com/MMZaini/kafi-explorer.git
cd kafi-explorer
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## License & Ethics

The project is intended as an educational and research resource. If parts of the repository are published under a specific license, they will be noted in their respective directories. If you need specific licensing or permission information for a given text or translation, please check the source files or contact the maintainers.

## Data sources

Hadith data is sourced from [thaqalayn.net](http://thaqalayn.net/) via the [ThaqalaynAPI](https://github.com/MohammedArab1/ThaqalaynAPI) by Mohammed Arab. We are grateful for their work in providing the JSON datasets of Al-Kafi with gradings and links, making this content programmatically accessible.

## Acknowledgements

This project was the first step toward the [Saadah Library](https://saadah-library.vercel.app/). Special thanks to the team behind [thaqalayn.net](http://thaqalayn.net/) and MohammedArab1 for the dataset APIs. Additional credits to Ali for early React and Copilot guidance, Mr Peace for his classroom leniency, and AI assistants for coding support.
