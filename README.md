# MeghDoot: Disaster Risk & Climate Scenario Command Center

MeghDoot is a Multi-Agent Climate Intelligence Platform designed to monitor, simulate, and recommend actions for climate and disaster scenarios (like floods, heatwaves, and water scarcity).

The project consists of a Python FastAPI backend (powering the AI Agents via Langchain/Gemini) and a React/Vite frontend (providing a Next-Gen Glassmorphic Dashboard).

## Project Structure

- `/backend`: FastAPI server, SQLAlchemy models, and Langchain-powered AI Agents.
- `/frontend`: React + Vite application using Tailwind CSS v4, Framer Motion, and Recharts.

---

## Getting Started for Teammates

### 1. Backend Setup (FastAPI)

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On Mac/Linux
   source venv/bin/activate
   ```
3. Install the Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your environment variables:
   - Copy `.env.example` to `.env`
   - Ensure your Gemini API Key is added inside the `.env` file.
5. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://127.0.0.1:8000`.

### 2. Frontend Setup (React/Vite)

1. Open a *new* terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the Node modules:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the local URL provided by Vite (usually `http://localhost:5173`) in your browser to see the MeghDoot Command Center!

## Key Features Built for the Hackathon

- **Mayor's Dashboard:** Features dynamic `CountUp` metric cards, an interactive Relief Allocator, Live Rescue Operation tracking, and a 1-click **Export Briefing to PDF** function that dynamically hides non-essential UI via `@media print`.
- **Scenario Simulator:** A beautiful glassmorphic control center featuring a "Live Agent Terminal" loading screen. Includes an **NLP Input Mode** that uses Gemini to extract sliders (Rainfall, Temp, etc.) directly from plain English disaster descriptions.
- **Citizen SOS Portal:** Simulates real-time civilian SOS reports that are passed through a LangChain Verification Agent. Features an interactive **"Dispatch Rescue Unit"** gameplay loop that directly increments the Mayor's Dashboard counters.
- **Floating Agent Telemetry:** A persistent right-sidebar overlay that floats gracefully over the map (preventing layout shifts) and displays individual agent intelligence and interactive "Deploy Action" commands.
- **Safe Route Mapping:** Utilizes Leaflet, Nominatim bounded-geocoding, and a custom pathfinding algorithm to route citizens away from draggable AI-identified disaster hazard zones.
- **Robust Local Persistence:** Simulation state, Citizen Reports, and form configurations are cached securely via `localStorage` to survive page reloads, with a dedicated "Reset System" button hidden securely in the TopNav Settings Modal.

## UI / UX Architecture
- **Tech Stack:** React, Vite, Tailwind CSS v4, Framer Motion, Recharts, and React-Leaflet.
- **Aesthetics:** Uses a premium "light-glass" theme featuring high-contrast text, smooth layout animations (`<AnimatePresence>`), dynamic scrollbars, and `z-[9999]` layered modals to ensure map components never swallow dropdowns.
