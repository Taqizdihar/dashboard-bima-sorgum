import { mockApi } from './mockApi';
import { HttpBimaApi } from './httpApi';
import { BimaApi } from './api';

// Uses mock implementation by default unless explicitly disabled
export const useMock = import.meta.env.VITE_USE_MOCK_API !== 'false';

// Read from local storage first (user settings), fallback to env, then default
const backendUrl = localStorage.getItem('bimaBackendUrl') ?? 
                   import.meta.env.VITE_BIMA_BACKEND_URL ?? 
                   '';

export const apiClient: BimaApi = useMock ? mockApi : new HttpBimaApi(backendUrl);

export * from './api';
