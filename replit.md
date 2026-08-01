# ADIXO TOP UP

## Overview
Premium gaming credit hub for Free Fire, PUBG, and more. A React + Vite + TypeScript frontend application with a Gemini AI chatbot assistant.

## Project Architecture
- **Frontend**: React 19 + TypeScript + Vite 6 (port 5000)
- **Backend**: Express.js (port 3001), proxied via Vite `/api`
- **Styling**: Tailwind CSS (CDN), Font Awesome icons, Google Fonts (Chakra Petch, Orbitron, Oxanium)
- **AI Integration**: Google Gemini API (`@google/generative-ai`)
- **Notifications**: Telegram Bot API for order notifications & management

## Project Structure
- `index.html` - HTML entry point
- `index.tsx` - React root mount
- `App.tsx` - Main application component
- `components/` - UI components (Auth, ChatWidget, Features, Footer, GameCard, Layout, PaymentGateway, DisclaimerPopup)
- `data.ts` - Game/product data
- `types.ts` - TypeScript type definitions
- `vite.config.ts` - Vite config (port 5000, proxies `/api` → port 3001)
- `server/index.js` - Express backend (orders, site control, Telegram webhook)
- `server/orders.json` - Persisted order data

## Environment Variables / Secrets
- `TELEGRAM_BOT_TOKEN` - Telegram bot token for order notifications (optional)
- `TELEGRAM_CHAT_ID` - Telegram chat ID to send order alerts to (optional)
- `GEMINI_API_KEY` - Google Gemini API key for AI chatbot (optional)

## How to Run on Replit
- **Workflow**: "Start application" — runs both backend (port 3001) and Vite dev server (port 5000)
- The app is accessible in the Replit preview pane on port 5000

## Scripts
- `npm run start` - Start backend + Vite dev server (used by Replit workflow)
- `npm run dev` - Vite dev server only
- `npm run build` - Build for production to `dist/`
- `npm run server` - Backend only

## Recent Changes
- 2026-02-16: Initial Replit setup - configured Vite for port 5000 with allowedHosts, removed conflicting importmap from index.html
- 2026-02-23: Refactored AI BOTS section on home page to only show a "Pro Bots" entry point that leads to the full package selection view.
- 2026-02-25: Updated Mystery Boxes with detailed drop information (Bots & Glory ranges) and new visual assets.
