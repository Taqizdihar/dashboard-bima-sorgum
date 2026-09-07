export type SystemStatus = 'Online' | 'Offline' | 'Degraded';

export interface SystemHealth {
  ragEngine: SystemStatus;
  llmServer: SystemStatus;
  activeModel: string;
  knowledgeSourcesCount: number;
  requestsToday: number;
  validationPassRate: number;
}

export type DocumentStatus = 'Ready' | 'Indexing' | 'Failed' | 'Needs Reindex';

export interface KnowledgeSource {
  id: string;
  name: string;
  category: string;
  type: string;
  chunks: number;
  source: string;
  indexedAt: string;
  status: DocumentStatus;
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  text: string;
}

export interface RetrievalResult {
  rank: number;
  documentName: string;
  similarity: number;
  category: string;
  chunkText: string;
  chunkId: string;
}

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  status: 'Active' | 'Available' | 'Offline';
  contextSize: string;
  requests: number;
}

export interface LLMRequest {
  id: string;
  timestamp: string;
  model: string;
  promptSummary: string;
  ragUsed: boolean;
  status: 'Success' | 'Failed' | 'Processing';
  durationMs: number;
  iterations: number;
}

export type PipelineStageStatus = 'success' | 'failed' | 'processing' | 'pending' | 'skipped';

export interface PipelineStage {
  name: string;
  status: PipelineStageStatus;
  durationMs?: number;
}

export interface PipelineExecution {
  id: string;
  querySummary: string;
  model: string;
  ragStatus: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  validationResult: 'VALID' | 'INVALID' | 'PROCESSING' | 'ERROR';
  iterations: number;
  durationMs: number;
  timestamp: string;
  stages: PipelineStage[];
}

export interface ValidationMetric {
  name: string;
  actual: string;
  target: string;
  status: 'PASS' | 'FAIL';
}

export interface ValidationResult {
  recipeName: string;
  targetAudience: string;
  metrics: ValidationMetric[];
  overallStatus: 'VALID' | 'INVALID';
  iterationHistory: { iteration: number; status: 'VALID' | 'FAILED' }[];
}

export interface ApiLog {
  id: string;
  method: string;
  route: string;
  status: number;
  durationMs: number;
  timestamp: string;
}

export interface SystemSettings {
  aiServerUrl: string;
  apiKeySet: boolean;
  activeModel: string;
  ragDefaultTopK: number;
  ragSimilarityThreshold: number;
  googleDriveConnected: boolean;
}
