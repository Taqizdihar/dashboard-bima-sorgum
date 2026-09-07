import React, { useEffect, useState, useRef } from 'react';
import { UploadCloud, RefreshCw, Folder, Trash2, FileText, CheckCircle2, Clock, X } from 'lucide-react';
import { apiClient } from '../services';
import { KnowledgeFileSummary, KnowledgeFileDetail, WatchedFolder } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';

export default function ListDokumen() {
  const [files, setFiles] = useState<KnowledgeFileSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [watchedFolder, setWatchedFolder] = useState<WatchedFolder | null>(null);
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeFileDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadData = async () => {
    try {
      const [filesData, folderData] = await Promise.all([
        apiClient.listKnowledgeFiles(),
        apiClient.getWatchedFolder()
      ]);
      setFiles(filesData);
      setWatchedFolder(folderData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    
    setUploading(true);
    try {
      await apiClient.uploadKnowledgeFile(selected);
      await loadData();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    setUploading(true);
    try {
      await apiClient.uploadKnowledgeFile(droppedFile);
      await loadData();
    } catch (err) {
      console.error("Drop upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await apiClient.deleteKnowledgeFile(name);
      await loadData();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete ALL documents?")) return;
    try {
      await apiClient.deleteAllKnowledgeFiles();
      await loadData();
    } catch (err) {
      console.error("Delete all failed", err);
    }
  };

  const handleScanFolder = async () => {
    if (!watchedFolder?.path) return;
    setScanning(true);
    try {
      const res = await apiClient.scanFolder(watchedFolder.path);
      alert(`Scanned successfully. Found ${res.newFilesFound} new files.`);
      await loadData();
    } catch (err) {
      console.error("Scan failed", err);
    } finally {
      setScanning(false);
    }
  };

  const handleChooseFolder = async () => {
    try {
      const newFolder = await apiClient.chooseFolder();
      if (newFolder) {
        await apiClient.setWatchedFolder(newFolder);
        await loadData();
      }
    } catch (err) {
      console.error("Choose folder failed", err);
    }
  };
  
  const handleViewDoc = async (name: string) => {
    setDetailLoading(true);
    setSelectedDoc(null);
    try {
      const detail = await apiClient.getKnowledgeFile(name);
      setSelectedDoc(detail);
    } catch (err) {
      console.error("Failed to fetch doc details", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case 'Ready':
        return <Badge variant="success" icon={<CheckCircle2 size={12} />}>Ready</Badge>;
      case 'Indexing':
        return <Badge variant="warning" icon={<Clock size={12} />}>Indexing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">List Dokumen</h1>
          <p className="text-slate-500 mt-1">Manage files in the BIMA Knowledge Base</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleDeleteAll} className="text-red-600 border-red-200 hover:bg-red-50">
            Delete All
          </Button>
          <Button onClick={() => fileInputRef.current?.click()} isLoading={uploading}>
            <UploadCloud size={16} className="mr-2" />
            Upload File
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".pdf,.txt,.md,.ipynb"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div 
              className="border-2 border-dashed border-slate-200 rounded-lg p-10 flex flex-col items-center justify-center text-slate-500 bg-slate-50 m-6 hover:bg-slate-100 hover:border-emerald-300 transition-colors cursor-pointer"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={32} className="mb-3 text-emerald-600" />
              <p className="font-medium text-slate-700">Click or drag file to this area to upload</p>
              <p className="text-sm mt-1">Supported formats: .pdf, .txt, .md, .ipynb</p>
            </div>
            
            <div className="px-6 pb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Uploaded Documents</h3>
              {loading ? (
                <div className="text-center py-8 text-slate-500">Loading documents...</div>
              ) : files.length === 0 ? (
                <div className="text-center py-8 text-slate-500 border border-slate-100 rounded-md bg-slate-50">No documents found.</div>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <th>Document Name</th>
                      <th>Type</th>
                      <th>Chunks</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map(file => (
                      <tr key={file.name} className="cursor-pointer hover:bg-slate-50" onClick={() => handleViewDoc(file.name)}>
                        <td className="font-medium">
                          <div className="flex items-center text-slate-900">
                            <FileText size={16} className="text-slate-400 mr-2" />
                            {file.name}
                          </div>
                        </td>
                        <td>{file.type}</td>
                        <td>{file.chunksCount}</td>
                        <td>{renderStatus(file.status)}</td>
                        <td className="text-right">
                          <button 
                            onClick={(e) => handleDelete(e, file.name)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Folder className="text-emerald-600" size={20} />
              <h3 className="text-lg font-semibold text-slate-800">Folder Ingestion</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Watch a local folder on the backend server for automatic or manual synchronization of documents.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Watched Folder Path</label>
                <div className="flex">
                  <input 
                    type="text" 
                    readOnly
                    value={watchedFolder?.path || 'Not set'}
                    className="flex-1 rounded-l-md border border-slate-300 px-3 py-2 text-sm bg-slate-50 text-slate-700 focus:outline-none"
                  />
                  <Button variant="secondary" className="rounded-l-none" onClick={handleChooseFolder}>
                    Change
                  </Button>
                </div>
              </div>

              <Button 
                className="w-full" 
                variant="outline" 
                onClick={handleScanFolder}
                isLoading={scanning}
                disabled={!watchedFolder?.path}
              >
                <RefreshCw size={16} className="mr-2" />
                Scan Folder Now
              </Button>
            </div>
          </Card>
          
          {(selectedDoc || detailLoading) && (
            <Card className="p-6 animate-in slide-in-from-right-4">
              <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{detailLoading ? 'Loading...' : selectedDoc?.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">Document Details & Chunks</p>
                </div>
                <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              
              {detailLoading ? (
                 <div className="text-center py-8 text-slate-500">Loading details...</div>
              ) : selectedDoc ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium mb-1">Type</p>
                      <p className="font-semibold text-slate-800">{selectedDoc.type}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium mb-1">Status</p>
                      <div>{renderStatus(selectedDoc.status)}</div>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-slate-700 mb-2">Chunks ({selectedDoc.chunksCount})</h4>
                  <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                    {selectedDoc.chunks && selectedDoc.chunks.length > 0 ? (
                      selectedDoc.chunks.map(chunk => (
                        <div key={chunk.id} className="bg-white border border-slate-200 rounded-md p-3 shadow-sm">
                          <p className="text-xs font-mono text-slate-400 mb-2">{chunk.id}</p>
                          <p className="text-sm text-slate-700 leading-relaxed">{chunk.text}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-slate-500 border border-slate-100 border-dashed rounded-md bg-slate-50">
                        No chunks available.
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
