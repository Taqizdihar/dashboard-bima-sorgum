import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Search, Plus, Filter, MoreVertical, FileText } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { KnowledgeSource } from '../types';

export default function KnowledgeBase() {
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    mockApi.getKnowledgeSources().then(data => {
      setSources(data);
      setLoading(false);
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready': return 'success';
      case 'Indexing': return 'warning';
      case 'Failed': return 'destructive';
      case 'Needs Reindex': return 'secondary';
      default: return 'default';
    }
  };

  const filteredSources = sources.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Knowledge Base</h1>
          <p className="text-sm text-slate-500 mt-1">Manage documents used for RAG retrieval.</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Add Source
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-900">24</div>
            <p className="text-sm text-slate-500">Total Documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-900">4,285</div>
            <p className="text-sm text-slate-500">Indexed Chunks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-semibold text-slate-900 truncate">Just now</div>
            <p className="text-sm text-slate-500">Last Indexed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-semibold text-emerald-600">Healthy</div>
            <p className="text-sm text-slate-500">Database Status</p>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search documents..." 
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter size={16} />
          Category
        </Button>
        <Button variant="outline" className="gap-2">
          <Filter size={16} />
          Status
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Document</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Chunks</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Indexed At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-32 text-slate-500">
                    Loading documents...
                  </TableCell>
                </TableRow>
              ) : filteredSources.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-32 text-slate-500">
                    No documents found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSources.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-emerald-600" />
                        <span className="truncate max-w-[250px]">{doc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">{doc.category}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">{doc.type}</TableCell>
                    <TableCell className="text-right">{doc.chunks}</TableCell>
                    <TableCell className="text-xs text-slate-500">{doc.source}</TableCell>
                    <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                      {new Date(doc.indexedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(doc.status)}>{doc.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4 text-slate-400" />
                      </Button>
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
