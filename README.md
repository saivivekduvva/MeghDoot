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

## Recent UI Updates
- **Light Theme**: The UI is currently styled in a premium "light-glass" theme using Tailwind v4.
- **Components**: The Dashboard includes `StatCards`, `ScenariosTable`, and a `RightSidebar` with pulsing AI agent telemetries and actionable risk items.
