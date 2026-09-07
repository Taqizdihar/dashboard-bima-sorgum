import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Database, ChevronRight, ChevronDown } from 'lucide-react';
import { apiClient } from '../services';
import { AIModel, ChatSource } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
  isStreaming?: boolean;
}

export default function ChatRag() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [useRag, setUseRag] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Attempt to load models (using mock or local config)
    const llmServerUrl = localStorage.getItem('llmServerUrl') || import.meta.env.VITE_LLM_SERVER_URL || 'http://localhost:11434';
    apiClient.getModels(llmServerUrl, 'mock-key').then(data => {
      setModels(data);
      if (data.length > 0) setSelectedModel(data[0].id);
    }).catch(console.error);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    const botMsgId = (Date.now() + 1).toString();
    const initialBotMessage: Message = { id: botMsgId, role: 'assistant', content: '', isStreaming: true };
    
    setMessages(prev => [...prev, userMessage, initialBotMessage]);
    setInput('');
    setIsTyping(true);

    apiClient.streamChat(
      { message: userMessage.content, model: selectedModel, useRag },
      {
        onSources: (sources) => {
          setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, sources } : m));
        },
        onDelta: (text) => {
          setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: m.content + text } : m));
        },
        onDone: () => {
          setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, isStreaming: false } : m));
          setIsTyping(false);
        },
        onError: (err) => {
          console.error(err);
          setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, isStreaming: false, content: m.content + '\n\n[Error: Connection failed]' } : m));
          setIsTyping(false);
        }
      }
    );
  };

  const toggleSources = (msgId: string) => {
    setExpandedSources(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto p-4 sm:p-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Chat / RAG Test</h1>
          <p className="text-slate-500 mt-1">Test the pipeline and see retrieved chunks in action</p>
        </div>
        <div className="flex items-center space-x-4 bg-white p-2 rounded-lg border border-slate-200">
          <div className="flex items-center px-2">
            <input 
              type="checkbox" 
              id="useRag"
              checked={useRag}
              onChange={(e) => setUseRag(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mr-2"
            />
            <label htmlFor="useRag" className="text-sm font-medium text-slate-700">Use RAG</label>
          </div>
          <select 
            className="text-sm border-0 border-l border-slate-200 pl-4 py-1 bg-transparent focus:ring-0 text-slate-700"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {models.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden bg-white shadow-sm border-slate-200">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Bot size={48} className="mb-4 text-emerald-200" />
              <p className="text-lg font-medium text-slate-600">Start a conversation</p>
              <p className="text-sm">Ask about sorghum nutrition or recipes</p>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-800 ml-3' : 'bg-emerald-100 mr-3'}`}>
                    {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-emerald-700" />}
                  </div>
                  <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-slate-800 text-white rounded-tr-sm' 
                        : 'bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-sm'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}{msg.isStreaming ? <span className="animate-pulse">▋</span> : ''}</p>
                    </div>
                    
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 w-full">
                        <button 
                          onClick={() => toggleSources(msg.id)}
                          className="flex items-center text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors bg-emerald-50 px-2 py-1 rounded"
                        >
                          <Database size={12} className="mr-1" />
                          {msg.sources.length} sources used
                          {expandedSources[msg.id] ? <ChevronDown size={12} className="ml-1" /> : <ChevronRight size={12} className="ml-1" />}
                        </button>
                        
                        {expandedSources[msg.id] && (
                          <div className="mt-2 space-y-2">
                            {msg.sources.map((src, idx) => (
                              <div key={idx} className="text-xs bg-slate-50 border border-slate-200 rounded p-2 text-slate-600">
                                <span className="font-semibold text-slate-800 block mb-1">{src.documentName} (Chunk: {src.chunkId})</span>
                                {src.text && <span className="italic line-clamp-2">"{src.text}"</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <div className="relative flex items-center">
            <textarea
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none outline-none shadow-sm transition-all"
              rows={1}
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              size="sm"
              className="absolute right-2 bottom-2 rounded-lg"
              disabled={!input.trim() || isTyping}
              onClick={handleSend}
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
