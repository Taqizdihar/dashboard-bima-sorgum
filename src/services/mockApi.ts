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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simple in-memory state for the mock mode
let mockDocuments: KnowledgeFileDetail[] = [
  {
    name: 'PMK AKG 2019.pdf',
    type: 'PDF',
    chunksCount: 145,
    status: 'Ready',
    chunks: [
      { id: 'c-101', text: 'Kebutuhan protein harian untuk anak usia 7-9 tahun adalah 40 gram per hari, dengan asupan energi sekitar 1650 kkal.' },
      { id: 'c-102', text: 'Anjuran porsi makan sehari untuk anak usia 7-9 tahun meliputi makanan pokok, lauk pauk, sayuran, dan buah-buahan.' }
    ]
  },
  {
    name: 'PMBA Kemenkes.pdf',
    type: 'PDF',
    chunksCount: 89,
    status: 'Ready',
    chunks: [
      { id: 'c-145', text: 'Pemberian makanan tambahan untuk anak sekolah harus memenuhi minimal 15-20% dari Angka Kecukupan Gizi (AKG) harian.' }
    ]
  },
  {
    name: 'WHO_Nutrition_Guideline.pdf',
    type: 'PDF',
    chunksCount: 210,
    status: 'Indexing',
    chunks: []
  },
  {
    name: 'Sorghum_Nutritional_Profile.md',
    type: 'MD',
    chunksCount: 34,
    status: 'Ready',
    chunks: [
      { id: 'c-301', text: 'Sorghum is a gluten-free cereal grain that is rich in dietary fiber, protein, and essential minerals like iron and zinc.' }
    ]
  },
  {
    name: 'TKPI_Sorgum.txt',
    type: 'TXT',
    chunksCount: 12,
    status: 'Ready',
    chunks: [
      { id: 'c-401', text: 'Komposisi zat gizi sorgum per 100 gram: Energi 332 kkal, Protein 11.0 g, Lemak 3.3 g, Karbohidrat 73.0 g.' }
    ]
  }
];

let watchedFolderState: WatchedFolder = {
  path: '/home/bima/Health-Knowledge'
};

const mockModels: AIModel[] = [
  { id: 'm-1', name: 'MiMo V2.5 Pro', provider: 'cmc/xiaomi/mimo-v2.5-pro' },
  { id: 'm-2', name: 'Gemini 1.5 Flash', provider: 'google/gemini-1.5-flash' },
  { id: 'm-3', name: 'Llama 3 8B Instruct', provider: 'meta/llama-3-8b-instruct' },
];

export const mockApi: BimaApi = {
  async getHealth(): Promise<HealthStatus> {
    await delay(300);
    const totalChunks = mockDocuments.reduce((acc, doc) => acc + doc.chunksCount, 0);
    return {
      status: 'Online',
      chunksCount: totalChunks,
      documentsCount: mockDocuments.length
    };
  },
  
  async listKnowledgeFiles(): Promise<KnowledgeFileSummary[]> {
    await delay(400);
    return mockDocuments.map(doc => ({
      name: doc.name,
      type: doc.type,
      chunksCount: doc.chunksCount,
      status: doc.status
    }));
  },
  
  async getKnowledgeFile(name: string): Promise<KnowledgeFileDetail> {
    await delay(300);
    const doc = mockDocuments.find(d => d.name === name);
    if (!doc) throw new Error('File not found');
    return doc;
  },
  
  async uploadKnowledgeFile(file: File): Promise<void> {
    await delay(1000);
    const newDoc: KnowledgeFileDetail = {
      name: file.name,
      type: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
      chunksCount: Math.floor(Math.random() * 50) + 1,
      status: 'Ready',
      chunks: [
        { id: `c-${Date.now()}`, text: `Mock content extracted from ${file.name}.` }
      ]
    };
    mockDocuments = [newDoc, ...mockDocuments];
  },
  
  async deleteKnowledgeFile(name: string): Promise<void> {
    await delay(500);
    mockDocuments = mockDocuments.filter(d => d.name !== name);
  },
  
  async deleteAllKnowledgeFiles(): Promise<void> {
    await delay(800);
    mockDocuments = [];
  },
  
  async getWatchedFolder(): Promise<WatchedFolder> {
    await delay(200);
    return watchedFolderState;
  },
  
  async setWatchedFolder(folder: string): Promise<void> {
    await delay(400);
    watchedFolderState = { path: folder };
  },
  
  async scanFolder(folder: string): Promise<FolderScanResult> {
    await delay(1500);
    const newFilesFound = Math.floor(Math.random() * 5);
    for(let i=0; i<newFilesFound; i++) {
      mockDocuments.push({
        name: `Scanned_Doc_${Date.now()}_${i}.pdf`,
        type: 'PDF',
        chunksCount: 10 + i * 5,
        status: 'Ready',
        chunks: []
      });
    }
    return { newFilesFound };
  },
  
  async chooseFolder(): Promise<string> {
    await delay(500);
    return '/home/bima/Selected-Folder-' + Date.now();
  },

  async getModels(serverUrl: string, apiKey: string): Promise<AIModel[]> {
    await delay(600);
    if (!serverUrl) throw new Error("Server URL required");
    return mockModels;
  },
  
  streamChat(input: ChatInput, callbacks: ChatStreamCallbacks): void {
    let isCancelled = false;

    const runStream = async () => {
      await delay(500);
      if (isCancelled) return;

      if (input.useRag && callbacks.onSources) {
        callbacks.onSources([
          { documentName: 'PMK AKG 2019.pdf', chunkId: 'c-101' },
          { documentName: 'TKPI_Sorgum.txt', chunkId: 'c-401' }
        ]);
      }
      
      await delay(500);
      
      const words = "Berikut adalah rekomendasi resep berbahan sorgum untuk anak usia 8 tahun yang kaya akan protein dan serat pangan. Anda dapat membuat Bubur Sorgum Manis dengan tambahan susu dan madu.".split(" ");
      
      for (const word of words) {
        if (isCancelled) return;
        await delay(100);
        if (callbacks.onDelta) {
          callbacks.onDelta(word + " ");
        }
      }
      
      if (!isCancelled && callbacks.onDone) {
        callbacks.onDone();
      }
    };
    
    runStream().catch(err => {
      if (!isCancelled && callbacks.onError) callbacks.onError(err);
    });
    
    // In a real implementation we'd return an abort controller, 
    // but the interface returns void for simplicity now.
  }
};
