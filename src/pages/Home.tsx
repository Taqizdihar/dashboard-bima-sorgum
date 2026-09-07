import React, { useEffect, useState } from 'react';
import { ShieldCheck, Database, FileText } from 'lucide-react';
import { apiClient } from '../services';
import { HealthStatus } from '../types';
import { Card } from '../components/ui/Card';

export default function Home() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getHealth()
      .then(setHealth)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">BIMA Sorgum Dashboard</h1>
        <p className="text-slate-500 mt-2 text-lg">System Health & Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 flex items-center">
          <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
            <ShieldCheck className="text-emerald-600" size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Backend Status</p>
            <div className="flex items-center mt-1">
              <div className={`h-2.5 w-2.5 rounded-full mr-2 ${health?.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <h3 className="text-2xl font-bold text-slate-900">
                {loading ? '...' : health?.status || 'Unknown'}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 flex items-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <FileText className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Indexed Documents</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {loading ? '...' : health?.documentsCount ?? 0}
            </h3>
          </div>
        </Card>

        <Card className="p-6 flex items-center">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
            <Database className="text-amber-600" size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total RAG Chunks</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {loading ? '...' : health?.chunksCount ?? 0}
            </h3>
          </div>
        </Card>
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="/knowledge" className="p-4 border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors flex flex-col items-start">
            <span className="font-medium text-slate-900">Manage Knowledge Base</span>
            <span className="text-sm text-slate-500 mt-1">Upload and manage RAG documents</span>
          </a>
          <a href="/chat" className="p-4 border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors flex flex-col items-start">
            <span className="font-medium text-slate-900">Test RAG</span>
            <span className="text-sm text-slate-500 mt-1">Run queries and check responses</span>
          </a>
        </div>
      </Card>
    </div>
  );
}
