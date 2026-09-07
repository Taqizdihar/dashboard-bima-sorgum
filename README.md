# BIMA Sorgum AI Dashboard

This is the internal technical management dashboard for **BIMA Sorgum AI** (Basis Informasi Penelitian dan Pengabdian kepada Masyarakat).

This application serves as the control center for developers, researchers, and administrators to observe, debug, and manage the AI pipeline, RAG knowledge base, and models.

*Note: This is NOT the consumer-facing recipe app ("Dapur Sorgum Ceria").*

## Architecture

- **Frontend**: React 19, Vite, TypeScript
- **Routing**: React Router
- **Styling**: Tailwind CSS, Lucide React
- **API Strategy**: The app utilizes a service layer (`src/services/`) that switches between a `MockBimaApi` and `HttpBimaApi` based on environment variables. 
- **Mock First**: The app defaults to **Mock API Mode** to allow seamless frontend review without requiring the actual backend server to be running.

### Key Features (MVP)

- **Home**: System health, RAG chunk counts, and quick action links.
- **List Dokumen**: Manage the knowledge base. View details, chunks, and support for document ingestion via single file upload or folder scanning.
- **Chat / RAG Test**: A mock streaming interface to test prompts against the LLM/RAG engine.
- **Models**: List available LLM models on the currently configured server.
- **API & Docs**: Reference for the frontend-to-backend API contract.
- **Settings**: Configure the BIMA Backend URL and LLM Server URL (saved to local storage).

## Running the Project

```bash
npm install
npm run dev
```

The application will start on port 3000. 

## Configuration

The application reads from local storage first, then falls back to environment variables. See `.env.example`:

```env
VITE_USE_MOCK_API=true
VITE_BIMA_BACKEND_URL=""
VITE_LLM_SERVER_URL="http://localhost:20128/v1"
```

- Mock mode is default.
- BIMA backend URL is intentionally blank until backend host/port is confirmed.
- LLM prototype URL example is http://localhost:20128/v1.
- LLM API key is configured at runtime in Settings.
- POST /api/chat request schema is still pending backend confirmation.

To connect to a real backend, set `VITE_USE_MOCK_API=false` and provide the correct URLs. Or, configure them in the Settings page in the UI.
