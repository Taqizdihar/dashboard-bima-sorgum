/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/Overview';
import KnowledgeBase from './pages/KnowledgeBase';
import RetrievalExplorer from './pages/RetrievalExplorer';
import PipelineExecutions from './pages/PipelineExecutions';
import Settings from './pages/Settings';
import Validation from './pages/Validation';
import ApiLogs from './pages/ApiLogs';

// Placeholders for other pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-8 h-full flex flex-col">
    <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">{title}</h1>
    <div className="flex-1 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500">
      {title} is under construction
    </div>
  </div>
);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="retrieval" element={<RetrievalExplorer />} />
          <Route path="rag-playground" element={<Placeholder title="RAG Playground" />} />
          <Route path="models" element={<Placeholder title="LLM Models" />} />
          <Route path="requests" element={<Placeholder title="LLM Requests" />} />
          <Route path="llm-playground" element={<Placeholder title="LLM Playground" />} />
          <Route path="executions" element={<PipelineExecutions />} />
          <Route path="validation" element={<Validation />} />
          <Route path="logs" element={<ApiLogs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}
