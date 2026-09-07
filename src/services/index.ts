import { mockApi } from './mockApi';
import { HttpBimaApi } from './httpApi';
import { BimaApi } from './api';

// Uses mock implementation by default if env var is set,
// else uses real http client.
const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';
const backendUrl = import.meta.env.VITE_BIMA_BACKEND_URL || 'http://localhost:8000';

export const apiClient: BimaApi = useMock ? mockApi : new HttpBimaApi(backendUrl);

export * from './api';
