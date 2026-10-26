# BagOfWords.tech

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Deploy-Cloudflare_Workers-F38020?style=flat-square&logo=cloudflare)](https://workers.cloudflare.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

> Explore the depths of Artificial Intelligence, Machine Learning, and Natural Language Processing through clear, interactive, and high-impact technical articles.

---

## Features

- **Interactive Learning**: Interactive NLP and LLM visualizers with scrollytelling components.
- **MDX Article Engine**: Fast static article indexation with rich frontmatter, code highlighting, and metadata.
- **Edge Deployment**: Built with Next.js 15 and deployed on Cloudflare Workers using OpenNext.
- **Storage & Data**: Cloudflare D1 SQL database integration and Cloudflare R2 asset CDN.
- **AI Integration**: AI-assisted summaries and tools powered by Google Gemini and Cloudflare Workers AI.
- **Design & Theme**: Responsive UI using Radix UI primitives, Lucide icons, and light/dark theme toggle.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 15 (App Router, Turbopack, React 18) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS, Radix UI primitives, Lucide Icons, Framer Motion |
| **Edge Runtime** | OpenNext for Cloudflare (`@opennextjs/cloudflare`), Wrangler |
| **Database & Storage** | Cloudflare D1 (SQL), Cloudflare R2 (Assets) |
| **AI & APIs** | Google Generative AI (`@google/generative-ai`), Cloudflare Workers AI, Razorpay |

---


## Project Structure

```text
├── public/                 # Static public assets (icons, manifests)
├── scripts/                # Build and indexing scripts (generate-articles-index.mjs)
├── src/
│   ├── app/                # Next.js App Router (pages, layouts, API routes)
│   ├── components/         # Reusable UI & article components (interactive visualizers, layouts)
│   ├── content/articles/   # MDX technical articles & publications
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Database clients, utility helpers, email, and API adapters
│   └── types/              # Global TypeScript interfaces and definitions
├── open-next.config.ts     # OpenNext Cloudflare deployment configuration
├── wrangler.jsonc          # Cloudflare Worker, D1 database, and binding configurations
└── tsconfig.json           # TypeScript configuration
```

---

## License

Private / All Rights Reserved. Created by [Adil Naib](https://bagofwords.tech/about).
