import React from 'react';
import { Trash2, Eye, Clock, Shield } from 'lucide-react';
import { ScanHistory as ScanHistoryType } from '../types';

interface ScanHistoryProps {
  history: ScanHistoryType[];
  onViewScan: (scanId: string) => void;
  onDeleteScan: (scanId: string) => void;
  onClearHistory: () => void;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({
  history,
  onViewScan,
  onDeleteScan,
  onClearHistory
}) => {
  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-cyan-400/30 shadow-2xl shadow-cyan-400/10 relative overflow-hidden group hover:shadow-cyan-400/20 transition-all duration-500">
      {/* Animated Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-indigo-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-cyan-400/20 via-blue-400/20 to-indigo-400/20 rounded-xl border border-cyan-400/40 shadow-xl shadow-cyan-400/20 backdrop-blur-sm animate-pulse">
              <Clock className="w-6 h-6 text-cyan-300" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Scan History
            </h2>
          </div>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm rounded-lg border border-red-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 transform hover:scale-105"
            >
              Clear
            </button>
          )}
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-6 bg-gradient-to-br from-cyan-400/10 via-blue-400/10 to-indigo-400/10 rounded-2xl border border-cyan-400/30 mb-6 inline-block shadow-xl shadow-cyan-400/10 backdrop-blur-sm">
                <Clock className="w-16 h-16 mx-auto mb-4 text-cyan-400/60 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-300 mb-3">No scan history yet</h3>
              <p className="text-sm text-slate-400">Your scans will appear here</p>
            </div>
          ) : (
            history.map((scan) => (
              <div
                key={scan.id}
                className="bg-gradient-to-r from-slate-700/40 to-slate-600/40 rounded-xl p-5 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/20 backdrop-blur-sm group/item transform hover:scale-102"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-lg border border-cyan-400/30 shadow-lg shadow-cyan-400/10">
                        <Shield className="w-4 h-4 text-cyan-300" />
                      </div>
                      <h3 className="font-bold text-slate-200 text-sm truncate">
                        {scan.fileName}
                      </h3>
                    </div>
                    <p className="text-slate-400 text-xs mb-3">
                      {scan.timestamp}
                    </p>
                    <p className="text-slate-300 text-xs mb-4 line-clamp-2 leading-relaxed">
                      {scan.summary}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-3 py-1.5 rounded-full font-bold border ${
                        scan.vulnerabilityCount === 0 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' 
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30'
                      }`}>
                        {scan.vulnerabilityCount} vulnerabilities
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <button
                      onClick={() => onViewScan(scan.id)}
                      className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 rounded-lg transition-all duration-300 border border-cyan-400/20 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-400/20 transform hover:scale-110"
                      title="View Scan"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteScan(scan.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-300 border border-red-400/20 hover:border-red-400/40 hover:shadow-lg hover:shadow-red-500/20 transform hover:scale-110"
                      title="Delete Scan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};