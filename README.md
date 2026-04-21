# PlumeCast™ 2026: Hybrid Intelligence Platform

The tactical incident command platform for the modern era.
**Status**: Phase 1 (Skeleton) Complete.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Mapbox Public Token (Free)

### Installation
1.  Clone/Enter directory:
    ```powershell
    cd plumecast-2026
    ```
2.  Install dependencies:
    ```powershell
    npm install
    ```
3.  **Configure Environment**:
    Create `.env.local` and add your Mapbox token:
    ```properties
    NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ...
    ```
4.  Run Development Server:
    ```powershell
    npm run dev
    ```

## 🏗️ Architecture

### Frontend (Next.js + Mapbox + Deck.gl)
- **Framework**: Next.js 16 (App Router)
- **Map Engine**: Mapbox GL JS (Standard Style / 3D Buildings)
- **Visualization**: Deck.gl `MapboxOverlay` for high-performance geospatial rendering.
- **UI**: Tailwind CSS + Framer Motion (Glassmorphism HUD).

### Backend (Coming Phase 2)
- **Physics**: Rust (WASM) implementation of Gaussian Plume Model.
- **AI**: Vercel AI SDK integration for ERG RAG agent.

## 📂 Project Structure
- `/components/ui/plume-map.tsx`: Main 3D map view (Mapbox + Deck.gl).
- `/components/ui/hud.tsx`: Tactical overlay (Wind, Alerts, Controls).
- `/app`: Next.js App Router pages.

## ⚠️ Troubleshooting
- **Map not loading?** Check your `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env.local`.
- **Build errors?** Ensure you are using `npm run build` which handles the transpilation of ESM modules.
