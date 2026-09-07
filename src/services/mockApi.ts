import { BimaApi } from './api';
import * as mocks from '../mocks/data';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi: BimaApi = {
  async getSystemHealth() {
    await delay(300);
    return mocks.mockSystemHealth;
  },
  async getKnowledgeSources() {
    await delay(400);
    return mocks.mockKnowledgeSources;
  },
  async runRetrieval(query: string, topK: number, threshold: number) {
    await delay(800);
    return mocks.mockRetrievalResults;
  },
  async getModels() {
    await delay(300);
    return mocks.mockModels;
  },
  async getRequests() {
    await delay(500);
    return mocks.mockRequests;
  },
  async getPipelineExecutions() {
    await delay(600);
    return mocks.mockExecutions;
  },
  async getValidationResults() {
    await delay(400);
    return mocks.mockValidationResults;
  },
  async getLogs() {
    await delay(300);
    return mocks.mockLogs;
  },
  async getSettings() {
    await delay(200);
    return mocks.mockSettings;
  }
};
