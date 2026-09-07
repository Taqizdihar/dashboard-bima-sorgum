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

export interface BimaApi {
  getSystemHealth(): Promise<SystemHealth>;
  getKnowledgeSources(): Promise<KnowledgeSource[]>;
  runRetrieval(query: string, topK: number, threshold: number): Promise<RetrievalResult[]>;
  getModels(): Promise<LLMModel[]>;
  getRequests(): Promise<LLMRequest[]>;
  getPipelineExecutions(): Promise<PipelineExecution[]>;
  getValidationResults(): Promise<ValidationResult[]>;
  getLogs(): Promise<ApiLog[]>;
  getSettings(): Promise<SystemSettings>;
}
