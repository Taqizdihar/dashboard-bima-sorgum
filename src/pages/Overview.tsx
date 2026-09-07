import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Activity, Database, Server, Cpu, FileText, CheckCircle2, AlertCircle, ArrowRight, ActivityIcon, GitCommit } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { SystemHealth, PipelineExecution } from '../types';
import { cn } from '../utils/cn';
import { useNavigate } from 'react-router-dom';

export default function Overview() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [executions, setExecutions] = useState<PipelineExecution[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    mockApi.getSystemHealth().then(setHealth);
    mockApi.getPipelineExecutions().then(setExecutions);
  }, []);

  if (!health) {
    return <div className="p-8 flex justify-center items-center h-full text-slate-500">Loading system status...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ONLINE':
      case 'ACTIVE':
      case 'VALID':
      case 'SUCCESS':
        return 'success';
      case 'DEGRADED':
      case 'PROCESSING':
      case 'WARNING':
        return 'warning';
      case 'OFFLINE':
      case 'INVALID':
      case 'FAILED':
      case 'ERROR':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Overview</h1>
        <div className="text-sm text-slate-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase text-slate-500">RAG Engine</CardTitle>
            <Database className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-900">{health.ragEngine}</div>
            <p className="text-xs text-slate-500 mt-1">Status</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase text-slate-500">LLM Server</CardTitle>
            <Server className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-900">{health.llmServer}</div>
            <p className="text-xs text-slate-500 mt-1">Status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase text-slate-500">Active Model</CardTitle>
            <Cpu className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-slate-900 truncate" title={health.activeModel}>{health.activeModel}</div>
            <p className="text-xs text-slate-500 mt-1">Provider: cmc/xiaomi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase text-slate-500">Knowledge Base</CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-900">{health.knowledgeSourcesCount}</div>
            <p className="text-xs text-slate-500 mt-1">Indexed Documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase text-slate-500">Requests Today</CardTitle>
            <ActivityIcon className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-900">{health.requestsToday}</div>
            <p className="text-xs text-slate-500 mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase text-slate-500">Pass Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-900">{health.validationPassRate}%</div>
            <p className="text-xs text-slate-500 mt-1">Validation Success</p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Visualizer */}
      <Card>
        <CardHeader>
          <CardTitle>System Pipeline Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row justify-between items-center bg-slate-50 rounded-lg p-6 border border-slate-100">
            {[
              { name: 'Input', status: 'active' },
              { name: 'RAG Retrieval', status: 'active' },
              { name: 'Constraint Builder', status: 'active' },
              { name: 'LLM Generation', status: 'active' },
              { name: 'Rule Validator', status: 'active' },
              { name: 'Final Output', status: 'active' }
            ].map((stage, idx, arr) => (
              <React.Fragment key={stage.name}>
                <div className="flex flex-col items-center p-2 text-center w-32">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center mb-2 shadow-sm border",
                    stage.status === 'active' ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-slate-100 border-slate-200 text-slate-400"
                  )}>
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 leading-tight">{stage.name}</span>
                </div>
                {idx < arr.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-slate-300 hidden lg:block shrink-0" />
                )}
                {/* Vertical arrow for mobile */}
                {idx < arr.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-slate-300 block lg:hidden my-2 rotate-90" />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Executions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Executions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Execution ID</TableHead>
                <TableHead>Query Summary</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>RAG Status</TableHead>
                <TableHead>Validation</TableHead>
                <TableHead>Iterations</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {executions.map((exec) => (
                <TableRow 
                  key={exec.id} 
                  className="cursor-pointer"
                  onClick={() => navigate('/executions')}
                >
                  <TableCell className="font-medium text-emerald-700">{exec.id}</TableCell>
                  <TableCell>{exec.querySummary}</TableCell>
                  <TableCell className="text-slate-600 text-xs">{exec.model}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(exec.ragStatus)}>{exec.ragStatus}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(exec.validationResult)}>{exec.validationResult}</Badge>
                  </TableCell>
                  <TableCell>{exec.iterations}</TableCell>
                  <TableCell>{(exec.durationMs / 1000).toFixed(2)}s</TableCell>
                  <TableCell className="text-slate-500 whitespace-nowrap">
                    {new Date(exec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
