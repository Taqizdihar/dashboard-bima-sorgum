import React from 'react';
import { BookOpen, ExternalLink, Activity } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function ApiDocs() {
  const backendUrl = import.meta.env.VITE_BIMA_BACKEND_URL || 'http://localhost:8000';
  
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">API & Docs</h1>
        <p className="text-slate-500 mt-1">Backend API references and observability</p>
      </div>

      <Card className="p-8 flex flex-col md:flex-row items-center justify-between border-emerald-100 bg-emerald-50/30">
        <div className="flex items-start mb-4 md:mb-0">
          <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center mr-4 flex-shrink-0">
            <BookOpen className="text-emerald-700" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">OpenAPI Documentation</h3>
            <p className="text-slate-600 mt-1 max-w-lg">
              View the interactive Swagger UI for the BIMA backend. Test endpoints, review schema definitions, and explore the API surface.
            </p>
          </div>
        </div>
        <a href={`${backendUrl}/docs`} target="_blank" rel="noopener noreferrer">
          <Button>
            Open Swagger UI
            <ExternalLink size={16} className="ml-2" />
          </Button>
        </a>
      </Card>

      <Card className="p-8 flex flex-col md:flex-row items-center justify-between border-slate-200">
        <div className="flex items-start mb-4 md:mb-0">
          <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center mr-4 flex-shrink-0">
            <Activity className="text-slate-700" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">API Telemetry & Logs</h3>
            <p className="text-slate-600 mt-1 max-w-lg">
              System observability module. Connects to backend log streams and traces.
            </p>
          </div>
        </div>
        <Button variant="outline" disabled>
          View Telemetry (Coming Soon)
        </Button>
      </Card>
    </div>
  );
}
