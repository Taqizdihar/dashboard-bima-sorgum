/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import ListDokumen from './pages/ListDokumen';
import ChatRag from './pages/ChatRag';
import Models from './pages/Models';
import ApiDocs from './pages/ApiDocs';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="knowledge" element={<ListDokumen />} />
          <Route path="chat" element={<ChatRag />} />
          <Route path="models" element={<Models />} />
          <Route path="docs" element={<ApiDocs />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
