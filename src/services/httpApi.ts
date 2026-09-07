import { BimaApi, ChatStreamCallbacks } from './api';
import { 
  HealthStatus,
  KnowledgeFileSummary,
  KnowledgeFileDetail,
  WatchedFolder,
  FolderScanResult,
  AIModel,
  ChatInput 
} from '../types';

export class HttpBimaApi implements BimaApi {
  constructor(private baseUrl: string) {}

  private getUrl(path: string) {
    return `${this.baseUrl}${path}`;
  }

  async getHealth(): Promise<HealthStatus> {
    const res = await fetch(this.getUrl('/api/health'));
    if (!res.ok) throw new Error('Failed to fetch health');
    // Schema mapping pending backend contract
    return res.json();
  }

  async listKnowledgeFiles(): Promise<KnowledgeFileSummary[]> {
    const res = await fetch(this.getUrl('/api/knowledge/files'));
    if (!res.ok) throw new Error('Failed to fetch knowledge files');
    // Schema mapping pending backend contract
    return res.json();
  }

  async getKnowledgeFile(name: string): Promise<KnowledgeFileDetail> {
    const res = await fetch(this.getUrl(`/api/knowledge/files/${encodeURIComponent(name)}`));
    if (!res.ok) throw new Error('Failed to fetch knowledge file detail');
    // Schema mapping pending backend contract
    return res.json();
  }

  async uploadKnowledgeFile(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch(this.getUrl('/api/knowledge/upload'), {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload file');
  }

  async deleteKnowledgeFile(name: string): Promise<void> {
    const res = await fetch(this.getUrl(`/api/knowledge/files/${encodeURIComponent(name)}`), {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete file');
  }

  async deleteAllKnowledgeFiles(): Promise<void> {
    const res = await fetch(this.getUrl('/api/knowledge/files'), {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete all files');
  }

  async getWatchedFolder(): Promise<WatchedFolder> {
    const res = await fetch(this.getUrl('/api/knowledge/watched-folder'));
    if (!res.ok) throw new Error('Failed to fetch watched folder');
    // Schema mapping pending backend contract
    return res.json();
  }

  async setWatchedFolder(folder: string): Promise<void> {
    const res = await fetch(this.getUrl('/api/knowledge/watched-folder'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder })
    });
    if (!res.ok) throw new Error('Failed to set watched folder');
  }

  async scanFolder(folder: string): Promise<FolderScanResult> {
    const res = await fetch(this.getUrl('/api/knowledge/scan-folder'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder })
    });
    if (!res.ok) throw new Error('Failed to scan folder');
    // Schema mapping pending backend contract
    return res.json();
  }

  async chooseFolder(): Promise<string> {
    const res = await fetch(this.getUrl('/api/knowledge/choose-folder'));
    if (!res.ok) throw new Error('Failed to choose folder');
    const data = await res.json();
    return data.folder || '';
  }

  async getModels(serverUrl: string, apiKey: string): Promise<AIModel[]> {
    const res = await fetch(this.getUrl('/api/models'), {
      headers: {
        'X-Server-Url': serverUrl,
        'X-Api-Key': apiKey
      }
    });
    if (!res.ok) throw new Error('Failed to fetch models');
    // Schema mapping pending backend contract
    return res.json();
  }

  streamChat(input: ChatInput, callbacks: ChatStreamCallbacks): void {
    // Pending final backend request schema.
    fetch(this.getUrl('/api/chat'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`Failed to stream chat: ${res.status}`);
      }
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (callbacks.onDone) callbacks.onDone();
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        
        // Defensive parsing - assuming simple line-by-line SSE sequence
        // sources -> delta -> delta -> [DONE]
        // This parser might need adjustment when real contract is verified
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (!line.trim()) continue;
          
          if (line.includes('[DONE]')) {
            if (callbacks.onDone) callbacks.onDone();
            return;
          }

          // Mock mapping logic
          if (line.startsWith('sources:')) {
            try {
              const sources = JSON.parse(line.replace('sources:', ''));
              if (callbacks.onSources) callbacks.onSources(sources);
            } catch (e) {
              console.warn("Could not parse sources", line);
            }
          } else if (line.startsWith('delta:')) {
            const text = line.replace('delta:', '');
            if (callbacks.onDelta) callbacks.onDelta(text);
          } else {
            // fallback generic delta
            if (callbacks.onDelta) callbacks.onDelta(line);
          }
        }
      }
    })
    .catch(err => {
      if (callbacks.onError) callbacks.onError(err);
    });
  }
}
