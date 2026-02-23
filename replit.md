# ADIXO TOP UP

## Overview
Premium gaming credit hub for Free Fire, PUBG, and more. A React + Vite + TypeScript frontend application with a Gemini AI chatbot assistant.

## Project Architecture
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (CDN), Font Awesome icons, Google Fonts (Chakra Petch, Orbitron, Oxanium)
- **AI Integration**: Google Gemini API via `@google/genai`
- **Deployment**: Static site (Vite build to `dist/`)

## Project Structure
- `index.html` - HTML entry point
- `index.tsx` - React root mount
- `App.tsx` - Main application component
- `components/` - UI components (Auth, ChatWidget, Features, Footer, GameCard, Layout, PaymentGateway, DisclaimerPopup)
- `services/geminiService.ts` - Gemini AI service for chatbot
- `data.ts` - Game/product data
- `types.ts` - TypeScript type definitions
- `vite.config.ts` - Vite configuration (port 5000, all hosts allowed)

## Environment Variables
- `API_KEY` - Google Gemini API key (injected via Vite define)

## Scripts
- `npm run dev` - Start dev server on port 5000
- `npm run build` - Build for production to `dist/`
- `npm run preview` - Preview production build

## Recent Changes
- 2026-02-16: Initial Replit setup - configured Vite for port 5000 with allowedHosts, removed conflicting importmap from index.html
- 2026-02-23: Refactored AI BOTS section on home page to only show a "Pro Bots" entry point that leads to the full package selection view.
