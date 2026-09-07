import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

function Endpoint({ method, path, description, details }: { method: string, path: string, description: string, details?: React.ReactNode }) {
  const methodColors: Record<string, "default" | "success" | "warning" | "destructive" | "secondary"> = {
    GET: "success",
    POST: "warning",
    DELETE: "destructive",
  };
  
  return (
    <div className="border-b border-slate-100 last:border-0 py-6">
      <div className="flex items-center space-x-3 mb-2">
        <Badge variant={methodColors[method] || "default"}>{method}</Badge>
        <code className="text-sm font-semibold text-slate-800">{path}</code>
      </div>
      <p className="text-slate-600 mb-3 text-sm">{description}</p>
      {details && (
        <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-xs font-mono text-slate-700 overflow-x-auto whitespace-pre-wrap">
          {details}
        </div>
      )}
    </div>
  );
}

export default function ApiDocs() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">API Reference</h1>
        <p className="text-slate-500 mt-1">Current frontend-to-backend contract</p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-2 border-b pb-2">Health</h2>
        <Endpoint 
          method="GET" 
          path="/api/health" 
          description="Server status and number of indexed chunks."
        />
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-2 border-b pb-2">Knowledge Base</h2>
        
        <Endpoint 
          method="GET" 
          path="/api/knowledge/files" 
          description="List all indexed documents."
        />
        
        <Endpoint 
          method="GET" 
          path="/api/knowledge/files/{name}" 
          description="Get document detail and its chunks."
        />
        
        <Endpoint 
          method="POST" 
          path="/api/knowledge/upload" 
          description="Upload a new document for ingestion."
          details={`Content-Type: multipart/form-data
Field Name: file
Supported Formats: .pdf, .txt, .md, .ipynb`}
        />
        
        <Endpoint 
          method="DELETE" 
          path="/api/knowledge/files/{name}" 
          description="Delete a specific document."
        />
        
        <Endpoint 
          method="DELETE" 
          path="/api/knowledge/files" 
          description="Delete all documents."
        />
        
        <Endpoint 
          method="POST" 
          path="/api/knowledge/scan-folder" 
          description="Scan a folder for new documents."
          details={`Request JSON Schema:
{
  "folder": "string"
}`}
        />
        
        <Endpoint 
          method="GET" 
          path="/api/knowledge/watched-folder" 
          description="Get the currently watched folder."
        />
        
        <Endpoint 
          method="POST" 
          path="/api/knowledge/watched-folder" 
          description="Set the watched folder."
          details={`Request JSON Schema:
{
  "folder": "string"
}`}
        />
        
        <Endpoint 
          method="GET" 
          path="/api/knowledge/choose-folder" 
          description="Prompt the backend/OS to choose a folder."
        />
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-2 border-b pb-2">AI / Chat Engine</h2>
        
        <Endpoint 
          method="GET" 
          path="/api/models" 
          description="List available LLMs from the provider."
          details={`Required Headers:
X-Server-Url: string
X-Api-Key: string (optional)`}
        />
        
        <Endpoint 
          method="POST" 
          path="/api/chat" 
          description="Stream chat with the RAG engine."
          details={`Request JSON Schema:
{
  "message": "string",
  "model": "string",
  "useRag": boolean
}

Response format: Server-Sent Events (SSE) streaming.
Conceptual sequence: sources -> delta -> delta -> ... -> [DONE]

Note: Exact response JSON schemas pending final backend confirmation.`}
        />
      </Card>
    </div>
  );
}
