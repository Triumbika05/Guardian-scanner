import React, { useState, useRef } from 'react';
import { FileText, Upload, FolderOpen, Scan, RotateCcw, Code } from 'lucide-react';

interface CodeInputProps {
  onScan: (code: string, fileName: string) => void;
  isScanning: boolean;
}

export const CodeInput: React.FC<CodeInputProps> = ({ onScan, isScanning }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'file' | 'folder'>('text');
  const [code, setCode] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleTextScan = () => {
    if (code.trim()) {
      onScan(code, fileName || 'pasted-code.js');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onScan(content, file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleFolderUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      let combinedCode = '';
      let processedFiles = 0;
      const totalFiles = files.length;

      Array.from(files).forEach((file) => {
        if (file.name.endsWith('.js') || file.name.endsWith('.py') || file.name.endsWith('.ts')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            combinedCode += `\n// File: ${file.name}\n${content}\n`;
            processedFiles++;
            
            if (processedFiles === totalFiles) {
              onScan(combinedCode, `folder-scan-${totalFiles}-files`);
            }
          };
          reader.readAsText(file);
        } else {
          processedFiles++;
          if (processedFiles === totalFiles) {
            onScan(combinedCode, `folder-scan-${totalFiles}-files`);
          }
        }
      });
    }
  };

  const clearInput = () => {
    setCode('');
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (folderInputRef.current) folderInputRef.current.value = '';
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-cyan-400/30 shadow-2xl shadow-cyan-400/10 relative overflow-hidden group hover:shadow-cyan-400/20 transition-all duration-500">
      {/* Animated Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-indigo-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-cyan-400/20 via-blue-400/20 to-indigo-400/20 rounded-xl border border-cyan-400/40 shadow-xl shadow-cyan-400/20 backdrop-blur-sm animate-pulse">
            <Code className="w-6 h-6 text-cyan-300" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
            Input Code
          </h2>
        </div>
        
        <p className="text-slate-300 mb-8 text-lg leading-relaxed">
          Paste your code or upload a file to start the analysis.
        </p>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 bg-slate-700/30 p-2 rounded-xl border border-cyan-400/20 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 flex items-center justify-center gap-3 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'text'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 shadow-xl shadow-cyan-400/30 transform scale-105'
                : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-600/50 hover:shadow-lg hover:shadow-cyan-400/10'
            }`}
          >
            <FileText className="w-5 h-5" />
            Text
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 flex items-center justify-center gap-3 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'file'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 shadow-xl shadow-cyan-400/30 transform scale-105'
                : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-600/50 hover:shadow-lg hover:shadow-cyan-400/10'
            }`}
          >
            <Upload className="w-5 h-5" />
            File
          </button>
          <button
            onClick={() => setActiveTab('folder')}
            className={`flex-1 flex items-center justify-center gap-3 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === 'folder'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 shadow-xl shadow-cyan-400/30 transform scale-105'
                : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-600/50 hover:shadow-lg hover:shadow-cyan-400/10'
            }`}
          >
            <FolderOpen className="w-5 h-5" />
            Folder
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'text' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                File Name (optional)
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="e.g., main.js, app.py"
                className="w-full px-5 py-4 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-slate-200 placeholder-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-cyan-400/10"
              />
            </div>
            <div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                className="w-full h-64 px-5 py-4 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-slate-200 placeholder-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 transition-all duration-300 font-mono text-sm resize-none backdrop-blur-sm shadow-lg hover:shadow-cyan-400/10"
              />
            </div>
          </div>
        )}

        {activeTab === 'file' && (
          <div className="space-y-6">
            <input
              ref={fileInputRef}
              type="file"
              accept=".js,.py,.ts,.jsx,.tsx"
              onChange={handleFileUpload}
              className="w-full px-5 py-4 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-slate-200 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-cyan-500 file:to-blue-500 file:text-slate-900 file:cursor-pointer file:font-semibold hover:file:from-cyan-600 hover:file:to-blue-600 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-cyan-400/10"
            />
            <p className="text-sm text-slate-400 bg-slate-700/30 p-4 rounded-lg border border-cyan-400/20">
              Supported formats: .js, .py, .ts, .jsx, .tsx
            </p>
          </div>
        )}

        {activeTab === 'folder' && (
          <div className="space-y-6">
            <input
              ref={folderInputRef}
              type="file"
              multiple
              webkitdirectory=""
              onChange={handleFolderUpload}
              className="w-full px-5 py-4 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-slate-200 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-cyan-500 file:to-blue-500 file:text-slate-900 file:cursor-pointer file:font-semibold hover:file:from-cyan-600 hover:file:to-blue-600 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-cyan-400/10"
            />
            <p className="text-sm text-slate-400 bg-slate-700/30 p-4 rounded-lg border border-cyan-400/20">
              Select a folder containing your source code files
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={activeTab === 'text' ? handleTextScan : () => {}}
            disabled={isScanning || (activeTab === 'text' && !code.trim())}
            className="flex-1 flex items-center justify-center gap-3 py-4 px-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-600 text-slate-900 font-bold rounded-xl transition-all duration-300 disabled:cursor-not-allowed shadow-xl hover:shadow-cyan-400/30 transform hover:scale-105 disabled:transform-none"
          >
            {isScanning ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Scan className="w-5 h-5" />
                Scan Code
              </>
            )}
          </button>
          <button
            onClick={clearInput}
            disabled={isScanning}
            className="px-6 py-4 bg-slate-600/50 hover:bg-slate-500/50 disabled:bg-slate-700/50 text-slate-300 rounded-xl transition-all duration-300 disabled:cursor-not-allowed border border-cyan-400/20 hover:border-cyan-400/40 shadow-lg hover:shadow-cyan-400/20 transform hover:scale-105 disabled:transform-none"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};