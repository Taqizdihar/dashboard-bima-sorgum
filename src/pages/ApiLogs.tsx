import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { mockApi } from '../services/mockApi';
import { ApiLog } from '../types';
import { Activity, ServerCrash, Zap, Clock } from 'lucide-react';
import { cn } from '../utils/cn';

export default function ApiLogs() {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getLogs().then(data => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 400 && status < 500) return 'warning';
    if (status >= 500) return 'destructive';
    return 'default';
  };

  const getMethodColor = (method: string) => {
    switch(method) {
      case 'GET': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'POST': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'PUT': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'DELETE': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto pb-24">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">API & Logs</h1>
        <p className="text-sm text-slate-500 mt-1">Technical observability and server telemetry.</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Activity className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">Online</div>
              <p className="text-sm text-slate-500">Server Status</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">142</div>
              <p className="text-sm text-slate-500">Requests (24h)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <ServerCrash className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">0.7%</div>
              <p className="text-sm text-slate-500">Error Rate</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">842 ms</div>
              <p className="text-sm text-slate-500">Avg Latency</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
          <CardDescription>Live telemetry of the AI backend and pipeline API.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Method</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Duration</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-32 text-slate-500">
                    Loading logs...
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id} className="font-mono text-sm">
                    <TableCell>
                      <span className={cn("px-2 py-1 rounded text-xs font-semibold border", getMethodColor(log.method))}>
                        {log.method}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-700">{log.route}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(log.status)}>{log.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-slate-500">
                      {log.durationMs >= 1000 ? `${(log.durationMs / 1000).toFixed(2)}s` : `${log.durationMs}ms`}
                    </TableCell>
                    <TableCell className="text-right text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
