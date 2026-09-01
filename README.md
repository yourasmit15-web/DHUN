# DHUN

DHUN is a full-stack Spotify-like music app with a React frontend and Express backend.

## Features

- Search songs, artists, and albums
- Stream music online with no subscription
- Download available songs with no subscription
- Installable as a PWA on Android, iPhone, Windows, and macOS (via browser install / Add to Home Screen)

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
```

## Run in development

```bash
npm run dev
```

This starts:
- Backend API: `http://localhost:5000/api`
- Frontend app: `http://localhost:5173`

## Install app on device

- **Android (Chrome/Edge):** open the app URL and tap **Install App**.
- **Windows/macOS (Chrome/Edge):** open the app URL and use browser **Install app** option.
- **iPhone (Safari):** open the app URL, tap **Share** → **Add to Home Screen**.

## Build frontend

```bash
npm run build
```

## Environment (optional)

Frontend API base URL can be overridden with:

```bash
VITE_API_URL=http://localhost:5000/api
```
