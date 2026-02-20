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
  wordCount: number;
  characterCount: number;
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
    <div className="min-h-screen p-8" style={{ backgroundImage: "url('/sanrio-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Document Management
          </h1>
          <p className="text-gray-600">Secure file storage powered by Supabase</p>
        </div>

        {/* Upload area */}
        <div className="mb-8">
          <div className="bg-white/80 rounded-lg shadow-lg p-8 border-2 border-dashed border-pink-200 hover:border-pink-300 transition-colors">
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Drag or click to upload files
              </h2>
              <p className="text-gray-600 mb-6">
                Supports any file type: documents, images, archives, etc.
              </p>
              <label htmlFor="file-input" className="cursor-pointer">
                <div className="bg-pink-200 hover:bg-pink-300 text-pink-800 font-bold py-3 px-8 rounded-lg transition-colors cursor-pointer">
                  Choose Files
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
          </div>

          {/* Status messages */}
          {message && (
            <div
              className={`mt-4 p-4 rounded-lg font-semibold ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          {isLoading && (
            <div className="mt-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-600"></div>
                <span className="text-pink-600">Uploading...</span>
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-pink-600 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* File list */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-pink-600 text-white p-6">
            <h2 className="text-2xl font-bold">Uploaded Files ({files.length})</h2>
          </div>

          {files.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>No files uploaded yet — start by uploading some files!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Filename</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Uploaded At</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getFileIcon(file.name)}</span>
                          <a
                            href={file.publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-600 hover:text-pink-800 font-medium break-all"
                          >
                            {file.name}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {file.created_at
                          ? new Date(file.created_at).toLocaleString('en-US')
                          : 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => summarizeFile(file.name)}
                            disabled={summaryLoading === file.name}
                            className="inline-flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Generate AI summary"
                          >
                            <span>{summaryLoading === file.name ? 'Generating...' : 'Get Summary'}</span>
                          </button>
                          <a
                            href={file.publicUrl}
                            download
                            className="inline-flex items-center space-x-1 bg-pink-100 hover:bg-pink-200 text-pink-700 px-3 py-2 rounded transition-colors"
                            title="Download file"
                          >
                            <span>Download</span>
                          </a>
                          <button
                            onClick={() => deleteFile(file.name)}
                            className="inline-flex items-center space-x-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded transition-colors"
                            title="Delete file"
                          >
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Tip: Files are stored in Supabase object storage.</p>
          <p className="mt-2">Supports multi-file upload, download, delete, and AI summarization.</p>
        </div>

        {/* AI Summary Modal */}
        {showSummary && summaryData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="bg-blue-600 text-white p-6">
                <h2 className="text-2xl font-bold">AI Summary</h2>
                <p className="text-blue-100 mt-1">{summaryData.fileName}</p>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-gray-800 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {summaryData.summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Word Count</p>
                    <p className="text-2xl font-bold text-blue-600">{summaryData.wordCount}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Character Count</p>
                    <p className="text-2xl font-bold text-green-600">{summaryData.characterCount}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowSummary(false);
                      setSummaryData(null);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      if (summaryData) {
                        const text = `AI Summary for ${summaryData.fileName}\n\n${summaryData.summary}`;
                        navigator.clipboard.writeText(text);
                        setMessage({ type: 'success', text: '✓ Summary copied to clipboard' });
                      }
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
