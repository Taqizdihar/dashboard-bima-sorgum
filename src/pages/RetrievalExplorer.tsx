import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Search, Play, Settings2, FileText } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { RetrievalResult } from '../types';

export default function RetrievalExplorer() {
  const [query, setQuery] = useState('protein requirement for a 7 year old child');
  const [topK, setTopK] = useState('5');
  const [threshold, setThreshold] = useState('0.75');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RetrievalResult[]>([]);
  const [hasRun, setHasRun] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    const data = await mockApi.runRetrieval(query, parseInt(topK), parseFloat(threshold));
    setResults(data);
    setLoading(false);
    setHasRun(true);
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Retrieval Explorer</h1>
        <p className="text-sm text-slate-500 mt-1">Debug and inspect RAG retrieval behavior.</p>
      </div>

      {/* Query Configuration */}
      <Card className="shrink-0">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Query</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="pl-9 text-base"
                placeholder="Enter semantic search query..."
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-6 items-end">
            <div className="space-y-2 w-24">
              <label className="text-sm font-medium text-slate-700">Top K</label>
              <Input 
                type="number"
                value={topK}
                onChange={e => setTopK(e.target.value)}
                min="1"
                max="20"
              />
            </div>
            <div className="space-y-2 w-32">
              <label className="text-sm font-medium text-slate-700">Threshold</label>
              <Input 
                type="number"
                step="0.05"
                value={threshold}
                onChange={e => setThreshold(e.target.value)}
                min="0"
                max="1"
              />
            </div>
            
            <Button onClick={handleRun} disabled={loading} className="gap-2 px-8">
              {loading ? (
                <div className="h-4 w-4 rounded-full border-2 border-slate-200 border-t-white animate-spin" />
              ) : (
                <Play size={16} />
              )}
              Run Retrieval
            </Button>
            
            <Button variant="ghost" size="icon" className="ml-auto text-slate-400">
              <Settings2 size={18} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-12">
        {!hasRun ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <Search className="h-12 w-12 opacity-20" />
            <p>Run a query to see retrieval results.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <p>No results found matching your threshold.</p>
          </div>
        ) : (
          results.map((result) => (
            <Card key={result.chunkId} className="overflow-hidden">
              <div className="flex h-1.5 w-full bg-slate-100">
                <div 
                  className="bg-emerald-500 h-full" 
                  style={{ width: `${result.similarity * 100}%` }}
                />
              </div>
              <CardHeader className="py-4 flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200">
                      #{result.rank}
                    </Badge>
                    <FileText className="h-4 w-4 text-slate-400" />
                    <CardTitle className="text-base font-semibold text-emerald-800">
                      {result.documentName}
                    </CardTitle>
                  </div>
                  <div className="flex gap-4 text-xs text-slate-500">
                    <span>Chunk: {result.chunkId}</span>
                    <span>Category: {result.category}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-bold text-slate-700">
                    {result.similarity.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400">Similarity</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 border border-slate-100 rounded-md p-4 text-sm text-slate-700 leading-relaxed">
                  {result.chunkText}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
