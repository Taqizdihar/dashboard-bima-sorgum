import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { mockApi } from '../services/mockApi';
import { SystemSettings } from '../types';
import { Save, Server, Key, BrainCircuit, HardDrive, Cloud } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    mockApi.getSettings().then(data => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // Mock save delay
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
  };

  if (!settings) {
    return <div className="p-8 text-center text-slate-500">Loading settings...</div>;
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto pb-24">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure the BIMA AI system environment.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-emerald-600" />
              <CardTitle>AI Server</CardTitle>
            </div>
            <CardDescription>Configure connection to the local or remote AI provider.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Server URL</label>
              <Input 
                value={settings.aiServerUrl}
                onChange={e => setSettings({...settings, aiServerUrl: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">API Key</label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    type="password"
                    value={settings.apiKeySet ? "********-****-****-****-************" : ""}
                    readOnly
                    className="pl-9 text-slate-500 bg-slate-50"
                  />
                </div>
                <Button variant="outline">Update Key</Button>
              </div>
              <p className="text-xs text-slate-500">API keys are managed via AI Studio Secrets and injected at runtime.</p>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Active Model</label>
              <Input 
                value={settings.activeModel}
                onChange={e => setSettings({...settings, activeModel: e.target.value})}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2 text-sm">
              Status: <Badge variant="success">Connected</Badge>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-emerald-600" />
              <CardTitle>RAG Engine</CardTitle>
            </div>
            <CardDescription>Default parameters for knowledge retrieval.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-6">
              <div className="grid gap-2 flex-1">
                <label className="text-sm font-medium text-slate-700">Default Top K</label>
                <Input 
                  type="number"
                  value={settings.ragDefaultTopK}
                  onChange={e => setSettings({...settings, ragDefaultTopK: parseInt(e.target.value) || 5})}
                />
              </div>
              <div className="grid gap-2 flex-1">
                <label className="text-sm font-medium text-slate-700">Similarity Threshold</label>
                <Input 
                  type="number"
                  step="0.05"
                  value={settings.ragSimilarityThreshold}
                  onChange={e => setSettings({...settings, ragSimilarityThreshold: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-emerald-600" />
              <CardTitle>Document Sources</CardTitle>
            </div>
            <CardDescription>Manage connections to external knowledge repositories.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center">
                  <HardDrive className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 text-sm">Local Storage</h4>
                  <p className="text-xs text-slate-500">Read from local /data directory</p>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center">
                  <Cloud className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 text-sm">Google Drive</h4>
                  <p className="text-xs text-slate-500">Sync documents from Drive folders</p>
                </div>
              </div>
              {settings.googleDriveConnected ? (
                <Badge variant="success">Connected</Badge>
              ) : (
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Not Connected</Badge>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              )}
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
