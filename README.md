# [Project Name] — Full-Stack Kanban Board

> 🚧 **In active development.** This README reflects the intended scope — check off items as they ship, and delete this banner once the MVP is live.

A full-stack Kanban board built to explore production-grade patterns end to end: a typed Fastify API, a Postgres data layer, and a React frontend — built by [Stephen Osemene Emmanuel](https://emmanuel-stephen.onrender.com), a Senior Frontend Engineer expanding into full-stack development.

**[Live Demo →](#)** &nbsp;·&nbsp; **[API Docs →](#)**

![Kanban board screenshot](./docs/screenshot-board.png)

<!-- Replace with a real screenshot once the board UI is in a demoable state -->

---

## Why this project

Most of my production experience is deep on the frontend — React, TypeScript, Next.js, design systems, frontend architecture. This project is deliberately full-stack: I own the API, the schema, and the auth layer, not just the UI consuming them. It's the proving ground for the backend skills (Node/Fastify, PostgreSQL, and eventually C#/.NET) referenced on my [CV](https://emmanuel-stephen.onrender.com) and [portfolio](https://emmanuel-stephen.onrender.com).

## Tech Stack

| Layer      | Technology                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------- |
| Frontend   | React, TypeScript, [state mgmt — TBD: Zustand/Redux Toolkit], [styling — TBD: Tailwind CSS] |
| Backend    | Fastify, TypeScript, Node.js                                                                |
| Database   | PostgreSQL, [ORM — TBD: Prisma/Drizzle]                                                     |
| Auth       | [TBD: JWT / session-based]                                                                  |
| Testing    | [TBD: Jest / Vitest, Playwright]                                                            |
| Deployment | [TBD: Render/Railway/Fly.io — frontend + API]                                               |

## Features

- [ ] Create, rename, and delete boards
- [ ] Create, edit, and delete columns (lists)
- [ ] Create, edit, delete, and drag-and-drop reorder cards across columns
- [ ] User authentication (sign up / log in)
- [ ] Per-user board ownership and access control
- [ ] Real-time updates across sessions (WebSockets)
- [ ] Card details (description, labels, due dates, assignees)
- [ ] Responsive layout (mobile + desktop)

> Edit this list to match what's actually being built — an accurate roadmap is more credible than an aspirational one.

## Architecture

```
[client: React + TypeScript]
        │  REST (+ WebSocket for live updates)
        ▼
[server: Fastify + TypeScript]
        │
        ▼
[PostgreSQL]
```

A few notes on decisions worth calling out once made:

- Why Fastify over Express (performance, schema validation, plugin architecture)
- How the drag-and-drop reordering is persisted (e.g. fractional indexing vs. full re-sequencing)
- How auth and authorization are structured (who can see/edit which boards)

_(This section is where recruiters and other engineers judge technical depth — fill it in with real reasoning once the decisions are made, not just the tech names.)_

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL ≥ 14
- npm / pnpm / yarn

### Setup

```bash
# clone
git clone https://github.com/Emmanuelsteph7/[repo-name].git
cd [repo-name]

# install dependencies
npm install

# configure environment
cp .env.example .env
# fill in DATABASE_URL, JWT_SECRET, etc.

# run database migrations
npm run migrate

# start dev servers (client + server)
npm run dev
```

App runs at `http://localhost:3000` (client) and `http://localhost:4000` (API) by default — adjust once ports are finalized.

## Project Structure

```
.
├── apps/
│   ├── client/        # React frontend
│   └── server/        # Fastify API
├── packages/
│   └── shared/        # Shared types between client and server
└── docs/
```

_(Update to match actual structure — monorepo vs. separate repos, whatever you land on.)_

## Roadmap

- [ ] MVP: single-user board CRUD
- [ ] Auth + multi-user support
- [ ] Real-time collaboration
- [ ] Deploy live demo
- [ ] Write a blog post on the architecture decisions (ties into portfolio blog)

## Author

**Stephen Osemene Emmanuel** — Senior Frontend Engineer
[Portfolio](https://emmanuel-stephen.onrender.com) · [LinkedIn](https://www.linkedin.com/in/osemenestephen/) · [GitHub](https://github.com/Emmanuelsteph7)
