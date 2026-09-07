import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { mockApi } from '../services/mockApi';
import { PipelineExecution, PipelineStage } from '../types';
import { GitCommit, Clock, ArrowRight, CheckCircle2, XCircle, Loader2, PlayCircle, AlertCircle } from 'lucide-react';
import { cn } from '../utils/cn';

export default function PipelineExecutions() {
  const [executions, setExecutions] = useState<PipelineExecution[]>([]);
  const [selectedExec, setSelectedExec] = useState<PipelineExecution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getPipelineExecutions().then(data => {
      setExecutions(data);
      if (data.length > 0) setSelectedExec(data[0]);
      setLoading(false);
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
      case 'VALID':
        return 'success';
      case 'FAILED':
      case 'INVALID':
      case 'ERROR':
        return 'destructive';
      case 'PROCESSING':
        return 'warning';
      case 'SKIPPED':
      case 'PENDING':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const StageIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'processing': return <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />;
      case 'pending': return <PlayCircle className="h-5 w-5 text-slate-300" />;
      case 'skipped': return <ArrowRight className="h-5 w-5 text-slate-400" />;
      default: return <AlertCircle className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <div className="flex h-full max-h-screen overflow-hidden">
      {/* Left List */}
      <div className="w-1/2 flex flex-col border-r border-slate-200 bg-white">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Executions</h1>
          <p className="text-sm text-slate-500 mt-1">Pipeline trace and execution history.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading executions...</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {executions.map(exec => (
                <li 
                  key={exec.id}
                  className={cn(
                    "p-6 cursor-pointer hover:bg-slate-50 transition-colors",
                    selectedExec?.id === exec.id && "bg-emerald-50/50 hover:bg-emerald-50/50"
                  )}
                  onClick={() => setSelectedExec(exec)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-emerald-800 text-sm">{exec.id}</span>
                    <Badge variant={getStatusColor(exec.validationResult)}>{exec.validationResult}</Badge>
                  </div>
                  <div className="text-base font-medium text-slate-900 mb-2 truncate">
                    {exec.querySummary}
                  </div>
                  <div className="flex items-center text-xs text-slate-500 gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {(exec.durationMs / 1000).toFixed(2)}s
                    </span>
                    <span>Model: {exec.model}</span>
                    <span>{new Date(exec.timestamp).toLocaleTimeString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right Trace */}
      <div className="w-1/2 flex flex-col bg-slate-50 overflow-y-auto">
        {selectedExec ? (
          <div className="p-8 max-w-2xl mx-auto w-full space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{selectedExec.id}</h2>
                <Badge variant={getStatusColor(selectedExec.validationResult)}>{selectedExec.validationResult}</Badge>
              </div>
              <p className="text-slate-600 text-lg font-medium">{selectedExec.querySummary}</p>
              
              <div className="flex gap-4 mt-4 text-sm text-slate-500">
                <div className="bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
                  Model: <span className="font-medium text-slate-700">{selectedExec.model}</span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
                  Duration: <span className="font-medium text-slate-700">{(selectedExec.durationMs / 1000).toFixed(2)}s</span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
                  Iterations: <span className="font-medium text-slate-700">{selectedExec.iterations}</span>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader className="border-b border-slate-100">
                <CardTitle>Execution Trace</CardTitle>
                <CardDescription>Step-by-step pipeline execution log.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="relative pl-6 space-y-8 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-200">
                  {selectedExec.stages.map((stage, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[35px] top-0 bg-slate-50">
                        <StageIcon status={stage.status} />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "font-semibold text-sm",
                            stage.status === 'failed' ? "text-red-700" : "text-slate-900"
                          )}>
                            {idx + 1}. {stage.name}
                          </span>
                          {stage.durationMs !== undefined && (
                            <span className="text-xs text-slate-400 font-mono">
                              {stage.durationMs >= 1000 
                                ? `${(stage.durationMs / 1000).toFixed(2)} s` 
                                : `${stage.durationMs} ms`}
                            </span>
                          )}
                        </div>
                        <Badge 
                          variant={
                            stage.status === 'success' ? 'success' : 
                            stage.status === 'failed' ? 'destructive' : 'secondary'
                          } 
                          className="w-fit text-[10px] uppercase"
                        >
                          {stage.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {/* Final block */}
                  <div className="relative mt-8">
                    <div className="absolute -left-[35px] top-0 bg-slate-50">
                      <GitCommit className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-slate-500 uppercase">Final Result</span>
                      <Badge variant={getStatusColor(selectedExec.validationResult)} className="text-sm px-3">
                        {selectedExec.validationResult}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            Select an execution to view details
          </div>
        )}
      </div>
    </div>
  );
}
