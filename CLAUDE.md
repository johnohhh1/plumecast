# 🧠 PlumeCast™ 2026: Implementation Context & Roadmap

> **Living Document**: This file tracks the divergence between the original vision (`PlumeCast.txt`) and the current Next.js skeleton (`plumecast-2026`), and outlines the plan to bridge them.

---

## 📉 Gap Analysis (The Delta)

We are currently in **Phase 1 (Skeleton)**. There is a massive functional gap between the current codebase and the `PlumeCast.txt` specification.

| Feature | Vision (`PlumeCast.txt`) | Current Reality (`plumecast-2026`) | Status |
| :--- | :--- | :--- | :--- |
| **Incident Location** | Dynamic, Scene-aware | **Hardcoded** to NYC (40.7128, -74.0060). | 🔴 Critical Missing |
| **Weather Source** | Live OpenWeatherMap API | **Manual Sliders** (User sets speed/dir). | 🔴 Critical Missing |
| **Dispersion Physics** | Chemical-specific (Density, Molecular Wt) | **Generic** Gaussian plume (WASM). No chemical inputs. | 🟠 Basic Exists |
| **ERG/Chemical Data** | 6+ Critical Chemicals, Evac Zones | **None**. AI Chat is generic. | 🔴 Critical Missing |
| **Interaction** | Voice Alerts, Automatic Triggers | Manual Map controls only. | 🔴 Critical Missing |
| **Architecture** | Plugin System (Voice/Data) | Standalone Next.js App. | 🟡 Different (Modernized) |

---

## 🗺️ Implementation Roadmap

### 🚨 Priority 1: Core Context Awareness (The "Where" & "What")
*Goal: Stop assuming NYC. Stop assuming simulated wind.*

- [x] **Dynamic Incident Marking**:
    - Allow user to right-click map to "Set Incident Source".
    - Update Redux/Zustand/React Context with new lat/lon.
    - **Step 1 Goal**: Plume originates from where I click.
- [x] **Live Weather Integration**:
    - Fetch real weather for the selected lat/lon.
    - Fallback to "Manual Mode" if API fails (as per specs).
    - **Step 2 Goal**: Plume direction matches real world wind at that location.

### 🧪 Priority 2: Chemical Intelligence (The "Who")
*Goal: Make the physics engine specific to the chemical involved.*

- [x] **Chemical Database**:
    - Port the table from `PlumeCast.txt` (Chlorine, Ammonia, Hydrogen, etc.) into `src/data/chemicals.ts`.
    - Include: Vapor Density, Dispersion Factors, ERG default distances.
- [x] **Physics Engine Upgrade (TS)**:
    - **Pivot**: Switched to TypeScript implementation (`lib/physics-engine.ts`) to bypass WASM build issues and speed up iteration.
    - Implemented Gaussian Plume logic with Vapor Density adjustments.
    - Heavy gases now slump (wider/shorter), light gases rise (narrower/longer).

### 🗣️ Priority 3: Tactical Interface (The "How")
*Goal: Voice and actionable alerts.*

- [x] **Voice Synthesis**:
    - Implement browser `speechSynthesis` for high-priority alerts.
    - "Warning: Chlorine plume trending North-East."
- [x] **Smart Zoning**:
    - Draw "Immediate" vs "Caution" zones on the map (Deck.gl Polygon layers).

### 🧠 Priority 4: Context Context-Aware AI Commander (The "Brain")
*Goal: Intelligent tactical advice.*

- [x] **Context Injection**:
    - Inject current chemical, wind, and ERG data into Gemini System Prompt.
    - **Outcome**: AI gives specific advice (e.g., "Chlorine is heavy, avoid basements") rather than generic advice.

---

## 🛠️ Current Work Session

**Objective**: Establish truth. We cannot calculate dispersion if we don't know *where* we are or *what* the weather is.

### Immediate Task List
1.  **Refactor `plume-map.tsx`**: Add generic click handler to update `source_lat`/`source_lon`.
2.  **Create Chemical Store**: Define the const data structure for the supported chemicals.
3.  **Real Weather Hook**: Create a hook `useWeather(lat, lon)` that fetches user's local weather (or simulates it more realistically if API key missing).

---

## 📝 Notes & Constraints
- **Tech Stack**: Next.js 16, Mapbox GL JS, Deck.gl, Rust (WASM).
- **Aesthetics**: High-contrast "Dark Mode" tactical UI. Glassmorphism.
- **Performance**: Heavy physics calculations must stay in WASM/Workers.
