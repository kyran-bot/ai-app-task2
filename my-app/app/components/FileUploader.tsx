'use client';

import { useState, useRef, useEffect } from 'react';

// Note: please add your Sanrio background image to `my-app/public/sanrio-bg.png`
// for the page background to appear correctly.

interface UploadedFile {
  name: string;
  publicUrl: string;
  created_at: string;
  metadata?: {
    size: number;
  };
}

interface SummaryData {
  fileName: string;
  summary: string;
}

export default function FileUploader() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [summaryLoading, setSummaryLoading] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    for (const file of selectedFiles) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setIsLoading(true);
    setUploadProgress(0);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      setMessage({ type: 'success', text: `✓ File "${file.name}" uploaded successfully` });
      
      // 重新加载文件列表
      await loadFiles();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setMessage({ type: 'error', text: `✗ ${errorMessage}` });
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const loadFiles = async () => {
    try {
      const response = await fetch('/api/documents');
      if (!response.ok) throw new Error('Failed to load file list');
      
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const deleteFile = async (fileName: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch('/api/documents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName }),
      });

      if (!response.ok) throw new Error('Delete failed');

      setMessage({ type: 'success', text: '✓ File deleted successfully' });
      await loadFiles();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed';
      setMessage({ type: 'error', text: `✗ ${errorMessage}` });
    }
  };

  const summarizeFile = async (fileName: string) => {
    setSummaryLoading(fileName);
    setShowSummary(true);
    
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      setSummaryData(data);
      setMessage({ type: 'success', text: '✓ AI summary generated successfully' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Summarize failed';
      setMessage({ type: 'error', text: `✗ ${errorMessage}` });
      setShowSummary(false);
    } finally {
      setSummaryLoading(null);
    }
  };

  // 初始加载
  // Initial load
  useEffect(() => {
    loadFiles();
    const interval = setInterval(loadFiles, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    const iconMap: { [key: string]: string } = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      txt: '📋',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️',
      zip: '📦',
      rar: '📦',
      '7z': '📦',
    };

    return iconMap[ext || ''] || '📎';
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Summary App</h1>
          <p className="text-gray-500 mt-2">Document Analysis with ChatGPT</p>
        </div>

        {/* Main layout: Left and Right sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT SECTION: Upload and File List */}
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-8">
              <div className="text-center">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {files.length > 0 ? `${files[0]?.name?.substring(0, 40)}...` : 'No file selected'}
                </p>
                <label htmlFor="file-input" className="cursor-pointer">
                  <div className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-block">
                    1. Upload File
                  </div>
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    disabled={isLoading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Upload Progress */}
              {isLoading && (
                <div className="mt-6">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-blue-600 text-sm">Uploading...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Status Messages */}
            {message && (
              <div
                className={`p-4 rounded-lg font-semibold ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* File List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                <h2 className="font-bold">Files ({files.length})</h2>
              </div>
              
              {files.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No files uploaded yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {files.map((file, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate text-sm">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {file.created_at
                              ? new Date(file.created_at).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'Unknown'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => summarizeFile(file.name)}
                          disabled={summaryLoading === file.name}
                          className="flex-1 text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {summaryLoading === file.name ? 'Generating...' : '2. Generate AI Summary'}
                        </button>
                        <a
                          href={file.publicUrl}
                          download
                          className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-3 rounded transition-colors"
                        >
                          Download
                        </a>
                        <button
                          onClick={() => deleteFile(file.name)}
                          className="text-sm bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SECTION: Summary Result */}
          <div className="flex flex-col">
            <div className="bg-white rounded-lg border border-gray-200 flex-1 overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                <h2 className="font-bold">Summary Result</h2>
              </div>

              {summaryData ? (
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap">
                      {summaryData.summary}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      if (summaryData) {
                        const text = `AI Summary for ${summaryData.fileName}\n\n${summaryData.summary}`;
                        navigator.clipboard.writeText(text);
                        setMessage({ type: 'success', text: '✓ Summary copied to clipboard' });
                      }
                    }}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">
                      Upload a file and click the "Generate AI Summary" button to see the result here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Powered by ChatGPT - Files stored in Supabase</p>
        </div>
      </div>
    </div>
  );
}
