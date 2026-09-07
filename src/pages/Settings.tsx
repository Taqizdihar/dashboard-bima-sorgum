import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Save, Server, Link2, HardDrive } from 'lucide-react';

export default function Settings() {
  const [bimaBackendUrl, setBimaBackendUrl] = useState('');
  const [llmServerUrl, setLlmServerUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load from local storage or default to env
    setBimaBackendUrl(localStorage.getItem('VITE_BIMA_BACKEND_URL') || import.meta.env.VITE_BIMA_BACKEND_URL || 'http://localhost:8000');
    setLlmServerUrl(localStorage.getItem('VITE_LLM_SERVER_URL') || import.meta.env.VITE_LLM_SERVER_URL || 'http://localhost:11434');
  }, []);

  const handleSave = async () => {
    setSaving(true);
    
    // In a real app we might validate these URLs before saving
    localStorage.setItem('VITE_BIMA_BACKEND_URL', bimaBackendUrl);
    localStorage.setItem('VITE_LLM_SERVER_URL', llmServerUrl);
    
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    
    // Optionally trigger a reload to apply new settings to the API client
    window.location.reload();
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto pb-24">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure backend connections and paths.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-emerald-600" />
              <CardTitle>BIMA Backend Connection</CardTitle>
            </div>
            <CardDescription>Primary URL for the BIMA Python FastAPI server.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Backend URL</label>
              <Input 
                value={bimaBackendUrl}
                onChange={e => setBimaBackendUrl(e.target.value)}
              />
              <p className="text-xs text-slate-500">Includes the host and port (e.g. http://localhost:8000). Leave out trailing slash.</p>
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2 text-sm">
              Note: Changing this will reload the application.
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-emerald-600" />
              <CardTitle>LLM Provider Connection</CardTitle>
            </div>
            <CardDescription>Configure connection to the local or remote AI provider.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">LLM Server URL</label>
              <Input 
                value={llmServerUrl}
                onChange={e => setLlmServerUrl(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-emerald-600" />
              <CardTitle>Knowledge Sources</CardTitle>
            </div>
            <CardDescription>Default ingestion settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center">
                  <HardDrive className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 text-sm">Local Storage Mode</h4>
                  <p className="text-xs text-slate-500">Read from local /data directory</p>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-200">
        <Button size="lg" onClick={handleSave} disabled={saving} className="w-32">
          {saving ? (
            <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
