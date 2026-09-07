import {
  SystemHealth,
  KnowledgeSource,
  RetrievalResult,
  LLMModel,
  LLMRequest,
  PipelineExecution,
  ValidationResult,
  ApiLog,
  SystemSettings
} from '../types';

export const mockSystemHealth: SystemHealth = {
  ragEngine: 'Online',
  llmServer: 'Online',
  activeModel: 'MiMo V2.5 Pro',
  knowledgeSourcesCount: 24,
  requestsToday: 142,
  validationPassRate: 87.5
};

export const mockKnowledgeSources: KnowledgeSource[] = [
  { id: 'ks-1', name: 'PMK AKG 2019.pdf', category: 'Health Regulation', type: 'PDF', chunks: 145, source: 'Local', indexedAt: '2026-08-30T10:00:00Z', status: 'Ready' },
  { id: 'ks-2', name: 'PMBA Kemenkes.pdf', category: 'WHO Guidance', type: 'PDF', chunks: 89, source: 'Google Drive', indexedAt: '2026-08-29T14:30:00Z', status: 'Ready' },
  { id: 'ks-3', name: 'TKPI_Data_Sorgum.csv', category: 'Food Composition', type: 'CSV', chunks: 12, source: 'Local', indexedAt: '2026-08-31T09:15:00Z', status: 'Ready' },
  { id: 'ks-4', name: 'Sorghum_Nutritional_Profile.md', category: 'Sorghum Research', type: 'MD', chunks: 34, source: 'Local', indexedAt: '2026-08-31T11:20:00Z', status: 'Ready' },
  { id: 'ks-5', name: 'WHO_Child_Growth_Standards.pdf', category: 'WHO Guidance', type: 'PDF', chunks: 210, source: 'Google Drive', indexedAt: '2026-08-28T08:00:00Z', status: 'Indexing' },
];

export const mockRetrievalResults: RetrievalResult[] = [
  { rank: 1, documentName: 'PMK AKG 2019.pdf', similarity: 0.94, category: 'Health Regulation', chunkId: 'c-101', chunkText: 'Kebutuhan protein harian untuk anak usia 7-9 tahun adalah 40 gram per hari, dengan asupan energi sekitar 1650 kkal.' },
  { rank: 2, documentName: 'PMBA Kemenkes.pdf', similarity: 0.87, category: 'WHO Guidance', chunkId: 'c-145', chunkText: 'Pemberian makanan tambahan untuk anak sekolah harus memenuhi minimal 15-20% dari Angka Kecukupan Gizi (AKG) harian, dengan fokus pada protein bernilai biologi tinggi.' },
];

export const mockModels: LLMModel[] = [
  { id: 'm-1', name: 'MiMo V2.5 Pro', provider: 'cmc/xiaomi/mimo-v2.5-pro', status: 'Active', contextSize: '32k', requests: 1245 },
  { id: 'm-2', name: 'Gemini 1.5 Flash', provider: 'google/gemini-1.5-flash', status: 'Available', contextSize: '1m', requests: 340 },
  { id: 'm-3', name: 'Llama 3 8B Instruct', provider: 'meta/llama-3-8b-instruct', status: 'Offline', contextSize: '8k', requests: 89 },
];

export const mockRequests: LLMRequest[] = [
  { id: 'REQ-20260901-0148', timestamp: '2026-08-31T20:15:00Z', model: 'MiMo V2.5 Pro', promptSummary: 'Sorghum recipe for 7yo child', ragUsed: true, status: 'Success', durationMs: 2450, iterations: 2 },
  { id: 'REQ-20260901-0147', timestamp: '2026-08-31T19:45:00Z', model: 'MiMo V2.5 Pro', promptSummary: 'Gluten-free adult breakfast', ragUsed: true, status: 'Success', durationMs: 1800, iterations: 1 },
  { id: 'REQ-20260901-0146', timestamp: '2026-08-31T19:10:00Z', model: 'MiMo V2.5 Pro', promptSummary: 'Invalid constraint test', ragUsed: true, status: 'Failed', durationMs: 4500, iterations: 3 },
];

export const mockExecutions: PipelineExecution[] = [
  {
    id: 'EXEC-20260901-0148',
    querySummary: 'Sorghum Chicken Bowl for 7yo',
    model: 'MiMo V2.5 Pro',
    ragStatus: 'SUCCESS',
    validationResult: 'VALID',
    iterations: 2,
    durationMs: 3780,
    timestamp: '2026-08-31T20:15:00Z',
    stages: [
      { name: 'User Input', status: 'success', durationMs: 12 },
      { name: 'RAG Retrieval', status: 'success', durationMs: 184 },
      { name: 'Constraint Builder', status: 'success', durationMs: 18 },
      { name: 'LLM Generation', status: 'success', durationMs: 1820 },
      { name: 'Nutrition Calculator', status: 'success', durationMs: 24 },
      { name: 'Rule Validator', status: 'failed', durationMs: 11 },
      { name: 'LLM Regeneration', status: 'success', durationMs: 1710 },
      { name: 'Rule Validator', status: 'success', durationMs: 9 },
    ]
  },
  {
    id: 'EXEC-20260901-0149',
    querySummary: 'Sorghum cookies for toddlers',
    model: 'MiMo V2.5 Pro',
    ragStatus: 'SUCCESS',
    validationResult: 'INVALID',
    iterations: 3,
    durationMs: 5120,
    timestamp: '2026-08-31T20:18:00Z',
    stages: [
      { name: 'User Input', status: 'success', durationMs: 10 },
      { name: 'RAG Retrieval', status: 'success', durationMs: 150 },
      { name: 'Constraint Builder', status: 'success', durationMs: 15 },
      { name: 'LLM Generation', status: 'success', durationMs: 1500 },
      { name: 'Nutrition Calculator', status: 'success', durationMs: 20 },
      { name: 'Rule Validator', status: 'failed', durationMs: 10 },
      { name: 'LLM Regeneration', status: 'success', durationMs: 1600 },
      { name: 'Rule Validator', status: 'failed', durationMs: 10 },
      { name: 'LLM Regeneration', status: 'success', durationMs: 1700 },
      { name: 'Rule Validator', status: 'failed', durationMs: 10 },
    ]
  }
];

export const mockValidationResults: ValidationResult[] = [
  {
    recipeName: 'Sorgum Chicken Bowl',
    targetAudience: 'Child — Age 7',
    overallStatus: 'VALID',
    metrics: [
      { name: 'Energy', actual: '1475 kcal', target: '1400-1600', status: 'PASS' },
      { name: 'Protein', actual: '36.2 g', target: '>=34 g', status: 'PASS' },
      { name: 'Sugar', actual: '7.4%', target: '<10%', status: 'PASS' },
      { name: 'Allergens', actual: 'None', target: 'None', status: 'PASS' },
    ],
    iterationHistory: [
      { iteration: 1, status: 'FAILED' },
      { iteration: 2, status: 'VALID' },
    ]
  }
];

export const mockLogs: ApiLog[] = [
  { id: 'log-1', method: 'POST', route: '/v1/rag/query', status: 200, durationMs: 182, timestamp: '2026-08-31T20:20:01Z' },
  { id: 'log-2', method: 'POST', route: '/v1/recipe/generate', status: 200, durationMs: 2420, timestamp: '2026-08-31T20:19:15Z' },
  { id: 'log-3', method: 'GET',  route: '/v1/models', status: 200, durationMs: 24, timestamp: '2026-08-31T20:18:50Z' },
  { id: 'log-4', method: 'POST', route: '/v1/recipe/generate', status: 500, durationMs: 450, timestamp: '2026-08-31T20:15:22Z' },
];

export const mockSettings: SystemSettings = {
  aiServerUrl: 'http://localhost:20128/v1',
  apiKeySet: true,
  activeModel: 'cmc/xiaomi/mimo-v2.5-pro',
  ragDefaultTopK: 5,
  ragSimilarityThreshold: 0.75,
  googleDriveConnected: false,
};
