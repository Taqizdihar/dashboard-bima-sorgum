import {
  HealthStatus,
  KnowledgeFileSummary,
  KnowledgeFileDetail,
  WatchedFolder,
  FolderScanResult,
  AIModel,
  ChatInput,
  ChatSource
} from '../types';

export interface ChatStreamCallbacks {
  onSources?: (sources: ChatSource[]) => void;
  onDelta?: (text: string) => void;
  onDone?: () => void;
  onError?: (err: Error) => void;
}

export interface BimaApi {
  getHealth(): Promise<HealthStatus>;
  
  // Knowledge
  listKnowledgeFiles(): Promise<KnowledgeFileSummary[]>;
  getKnowledgeFile(name: string): Promise<KnowledgeFileDetail>;
  uploadKnowledgeFile(file: File): Promise<void>;
  deleteKnowledgeFile(name: string): Promise<void>;
  deleteAllKnowledgeFiles(): Promise<void>;
  
  // Folder Ingestion
  getWatchedFolder(): Promise<WatchedFolder>;
  setWatchedFolder(folder: string): Promise<void>;
  scanFolder(folder: string): Promise<FolderScanResult>;
  chooseFolder(): Promise<string>;

  // AI
  getModels(serverUrl: string, apiKey: string): Promise<AIModel[]>;
  streamChat(input: ChatInput, callbacks: ChatStreamCallbacks): void;
}
