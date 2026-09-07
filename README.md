# BIMA Sorgum AI Dashboard

This is the internal technical management dashboard for **BIMA Sorgum AI** (Basis Informasi Penelitian dan Pengabdian kepada Masyarakat).

This application serves as the control center for developers, researchers, and administrators to observe, debug, and manage the AI pipeline, RAG knowledge base, and validation systems.

*Note: This is NOT the consumer-facing recipe app ("Dapur Sorgum Ceria").*

## Current Architecture

- **Frontend Framework**: React 18, Vite, TypeScript
- **Routing**: React Router
- **Styling**: Tailwind CSS, Lucide React
- **API Strategy**: Clean separation between UI and data fetching. The app currently runs in **Mock API Mode** so it can be developed and styled completely independently of the backend.

### Project Structure

```
src/
├── components/
│   └── ui/           # Reusable styled UI components (Cards, Buttons, Tables, etc.)
├── layouts/
│   └── DashboardLayout.tsx # Main application shell and sidebar
├── pages/            # Page-level components matching the sidebar navigation
├── services/
│   ├── api.ts        # The main BimaApi interface
│   └── mockApi.ts    # The mock implementation used for this MVP
├── mocks/
│   └── data.ts       # Coherent BIMA-specific mock datasets
├── types/
│   └── index.ts      # TypeScript interfaces for the domain models
└── utils/
    └── cn.ts         # Tailwind class merging utility
```

## Running the Project

```bash
npm install
npm run dev
```

The application will start in mock mode, rendering realistic BIMA data without needing the actual AI server or PostgreSQL database.

## Environment Variables

Copy `.env.example` to `.env` if needed. 

```env
# Future use:
VITE_USE_MOCK_API=true
VITE_AI_BASE_URL=http://localhost:20128/v1
```

Currently, the `mockApi` is hardcoded to be used in the pages to guarantee the MVP works out-of-the-box.

## Future API Integration

To connect the real backend later:

1. Create a `HttpBimaApi` class that implements the `BimaApi` interface in `src/services/api.ts`.
2. Map the domain types (like `PipelineExecution` or `SystemHealth`) to your real REST/GraphQL responses.
3. Replace the `mockApi` imports in the pages with a configured instance of your HTTP adapter, ideally driven by `VITE_USE_MOCK_API`.

## BIMA Pipeline Modules

The dashboard pages map directly to the planned BIMA pipeline architecture:

- **RAG / Knowledge Base**: Manages the documents (e.g., AKG, TKPI) injected into the pipeline.
- **RAG / Retrieval Explorer**: Debugs what the AI is retrieving given a query, exposing similarities without exposing private chain-of-thought.
- **Pipeline / Executions**: Visualizes the full trace of: `User Input -> RAG -> Constraint Builder -> LLM Generation -> Nutrition Calculator -> Rule Validator -> Output`.
- **Pipeline / Validation**: Shows the deterministic checking of nutritional constraints against the generated recipe.
