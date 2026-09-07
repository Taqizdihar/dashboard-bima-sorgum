import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { mockApi } from '../services/mockApi';
import { ValidationResult } from '../types';
import { CheckCircle2, XCircle, ChevronRight, Scale } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Validation() {
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getValidationResults().then(data => {
      // Create a few more mock results for demonstration
      const moreResults: ValidationResult[] = [
        ...data,
        {
          recipeName: 'Sorgum Cookies',
          targetAudience: 'Toddler — Age 2-3',
          overallStatus: 'INVALID',
          metrics: [
            { name: 'Energy', actual: '180 kcal', target: '150-200 kcal', status: 'PASS' },
            { name: 'Protein', actual: '2.1 g', target: '>= 3.0 g', status: 'FAIL' },
            { name: 'Sugar', actual: '12%', target: '< 10%', status: 'FAIL' },
            { name: 'Texture', actual: 'Hard', target: 'Soft/Crumbly', status: 'FAIL' },
          ],
          iterationHistory: [
            { iteration: 1, status: 'FAILED' }
          ]
        }
      ];
      setResults(moreResults);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading validation traces...</div>;
  }

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto pb-24">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Validation Trace</h1>
        <p className="text-sm text-slate-500 mt-1">Deterministic rule-checking of AI generated recipes.</p>
      </div>

      <div className="space-y-8">
        {results.map((res, index) => (
          <Card key={index} className="overflow-hidden border-slate-200">
            <CardHeader className={cn(
              "border-b border-slate-100",
              res.overallStatus === 'VALID' ? "bg-emerald-50/30" : "bg-red-50/30"
            )}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Scale className={cn(
                      "h-5 w-5",
                      res.overallStatus === 'VALID' ? "text-emerald-600" : "text-red-500"
                    )} />
                    <CardTitle className="text-lg">{res.recipeName}</CardTitle>
                  </div>
                  <CardDescription>Target: {res.targetAudience}</CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={res.overallStatus === 'VALID' ? 'success' : 'destructive'} className="text-sm">
                    {res.overallStatus}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    {res.iterationHistory.map((history, i) => (
                      <React.Fragment key={i}>
                        <span className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium border",
                          history.status === 'VALID' ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"
                        )}>
                          {history.iteration}
                        </span>
                        {i < res.iterationHistory.length - 1 && <ChevronRight className="h-3 w-3" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Actual</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead className="w-[100px] text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {res.metrics.map((metric, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium text-slate-700">{metric.name}</TableCell>
                      <TableCell className={cn(
                        "font-mono text-sm",
                        metric.status === 'FAIL' ? "text-red-600 font-bold" : "text-slate-600"
                      )}>{metric.actual}</TableCell>
                      <TableCell className="text-slate-500 text-sm">{metric.target}</TableCell>
                      <TableCell className="text-right">
                        {metric.status === 'PASS' ? (
                          <div className="flex items-center justify-end text-emerald-600 text-sm font-medium gap-1">
                            <CheckCircle2 className="h-4 w-4" />
                            PASS
                          </div>
                        ) : (
                          <div className="flex items-center justify-end text-red-600 text-sm font-bold gap-1">
                            <XCircle className="h-4 w-4" />
                            FAIL
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {res.overallStatus === 'INVALID' && (
                <div className="bg-red-50 p-4 m-4 rounded-md border border-red-100">
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-red-800">System Action: Sent back for regeneration</h4>
                      <p className="text-sm text-red-600 mt-1">
                        The generated recipe failed constraint validation. The deficit information has been appended to the LLM feedback prompt for the next iteration.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
