import React, { useEffect, useState } from 'react';
import { Cpu, Server, Key, RefreshCw } from 'lucide-react';
import { apiClient } from '../services';
import { AIModel } from '../types';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export default function Models() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverUrl, setServerUrl] = useState(import.meta.env.VITE_LLM_SERVER_URL || 'http://localhost:11434');
  const [apiKey, setApiKey] = useState('');

  const loadModels = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getModels(serverUrl, apiKey);
      setModels(data);
    } catch (err) {
      console.error("Failed to load models", err);
      // Fallback empty to prevent crash
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Models</h1>
        <p className="text-slate-500 mt-1">Manage connected LLMs and generative models</p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <Server className="mr-2 text-emerald-600" size={20} />
          Provider Connection
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Server URL</label>
            <input 
              type="text" 
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
              placeholder="http://localhost:11434"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">API Key (Optional)</label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                placeholder="sk-..."
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={loadModels} isLoading={loading}>
            <RefreshCw size={16} className="mr-2" />
            Ping & Refresh
          </Button>
        </div>
      </Card>

      <Card>
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-xl flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 flex items-center">
            <Cpu className="mr-2 text-slate-500" size={18} />
            Available Models
          </h3>
          <Badge variant="secondary">{models.length} Models Found</Badge>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-slate-500">Connecting to provider...</div>
        ) : models.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-slate-50">
            No models found. Check connection settings.
          </div>
        ) : (
          <div className="p-4">
            <Table>
              <thead>
                <tr>
                  <th>Model Name</th>
                  <th>ID</th>
                  <th>Provider / Family</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {models.map(model => (
                  <tr key={model.id}>
                    <td className="font-medium text-slate-900">{model.name}</td>
                    <td className="text-slate-500 text-sm">{model.id}</td>
                    <td><Badge variant="outline">{model.provider}</Badge></td>
                    <td><Badge variant="success">Available</Badge></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
