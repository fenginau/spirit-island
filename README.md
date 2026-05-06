# Spirit Island Companion

Spirit Island Companion is a Vite + React app for browsing Spirit Island content and running lightweight game-session workflows in the browser.

It combines a spirit browser, adversary picker, card wiki, and saved game flow into a single mobile-friendly interface backed by local browser storage.

## Features

- Browse spirits with difficulty and expansion filters.
- Randomly draw a spirit and review previous draws.
- View local spirit play cards and unique power card imagery.
- Randomly pick adversaries and keep adversary history.
- Browse wiki card galleries for major powers, minor powers, fear cards, events, invaders, blight cards, and more.
- Start and save games with a setup wizard, player selections, adversary level, and board side.
- Score completed games and revisit saved game records later.
- Use Gemini-powered helpers for team naming and team composition suggestions.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Motion
- Docker + Nginx for production serving

## Project Structure

```text
src/
  components/      Reusable UI building blocks
  data/            Generated card data for the wiki and power cards
  screens/         Tab screens and game wizard flows
  AppMain.tsx      Main application state and orchestration
public/
  spirits/         Spirit images
  play-cards/      Spirit board and play card assets
  unique-powers/   Unique power card assets
  wiki-cards/      Reference card galleries
scripts/
  generate-*.mjs   Asset/data generation utilities
```

## Run Locally

Prerequisites:

- Node.js 22+
- npm

Install dependencies and start the Vite dev server:

```bash
npm install
npm run dev
```

The app serves on [http://localhost:3000](http://localhost:3000).

## AI Features

The app includes Gemini-backed helpers for:

- generating a team name from the chosen setup
- suggesting a spirit composition for a game

If you want to provide your own key for builds or deployment, create an env file from `.env.example` and set `GEMINI_API_KEY`.

## Build

Create a production build with:

```bash
npm run build
```

Preview the built app locally:

```bash
npm run preview
```

## Docker

Build and run the production container with Docker Compose:

```bash
docker compose up --build
```

The container serves the app on [http://localhost:28080](http://localhost:28080).

The Docker build accepts `GEMINI_API_KEY` as a build argument if you want to inject your own key during image creation.

## Data and Persistence

- Game history, spirit history, and adversary history are stored in `localStorage`.
- Most card and spirit content is served from checked-in static assets under `public/`.

## Scripts

- `npm run dev` starts the development server on port `3000`.
- `npm run build` creates the production bundle.
- `npm run preview` previews the production bundle locally.
- `npm run lint` runs TypeScript type-checking.

## Deployment

The repository includes:

- `Dockerfile` for multi-stage production builds
- `docker-compose.yml` for local container deployment
- `nginx.conf` for SPA routing support
