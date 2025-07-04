import React, { useState } from 'react';
import { ArrowLeft, Eye, Download, AlertTriangle, Shield, Info, FileText, TrendingUp, FileDown } from 'lucide-react';
import { ScanResult, Vulnerability } from '../types';
import { VulnerabilityModal } from './VulnerabilityModal';
import { VulnerabilityChart } from './VulnerabilityChart';

interface ScanResultsProps {
  result: ScanResult;
  onBack: () => void;
}

export const ScanResults: React.FC<ScanResultsProps> = ({ result, onBack }) => {
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);

  const exportToJSON = () => {
    const exportData = {
      ...result,
      exportInfo: {
        exportedAt: new Date().toISOString(),
        toolName: "Guardian Code Scan",
        version: "1.0.0",
        format: "JSON"
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `guardian-scan-report-${result.fileName.replace(/[^a-zA-Z0-9]/g, '_')}-${result.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guardian Code Scan Report - ${result.fileName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #e2e8f0; 
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: rgba(30, 41, 59, 0.8); 
            border-radius: 24px; 
            box-shadow: 0 25px 50px rgba(6, 182, 212, 0.2);
            overflow: hidden;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(6, 182, 212, 0.3);
        }
        .header { 
            background: linear-gradient(135deg, #0891b2 0%, #3b82f6 100%); 
            color: #f1f5f9; 
            padding: 40px; 
            text-align: center;
        }
        .header h1 { 
            font-size: 2.5rem; 
            margin-bottom: 10px; 
            font-weight: 700;
            text-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .header p { 
            font-size: 1.1rem; 
            opacity: 0.9;
        }
        .content { padding: 40px; }
        .meta-info { 
            background: rgba(51, 65, 85, 0.6); 
            padding: 20px; 
            border-radius: 16px; 
            margin-bottom: 30px;
            border-left: 4px solid #06b6d4;
            backdrop-filter: blur(10px);
        }
        .summary { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin: 30px 0; 
        }
        .stat-card { 
            padding: 25px; 
            border-radius: 16px; 
            text-align: center; 
            box-shadow: 0 8px 32px rgba(6, 182, 212, 0.1);
            transition: transform 0.3s;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(6, 182, 212, 0.2);
        }
        .stat-card:hover { transform: translateY(-4px); }
        .stat-card h3 { 
            font-size: 2.5rem; 
            margin-bottom: 8px; 
            font-weight: 700;
        }
        .stat-card p { 
            font-size: 0.9rem; 
            text-transform: uppercase; 
            letter-spacing: 0.5px;
            font-weight: 600;
        }
        .total { background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2)); color: #67e8f9; }
        .vulnerabilities { margin-top: 40px; }
        .vulnerabilities h2 { 
            font-size: 1.8rem; 
            margin-bottom: 25px; 
            color: #f1f5f9;
            border-bottom: 2px solid #06b6d4;
            padding-bottom: 10px;
        }
        .vulnerability { 
            border: 1px solid rgba(6, 182, 212, 0.3); 
            border-radius: 16px; 
            padding: 25px; 
            margin: 20px 0; 
            background: rgba(51, 65, 85, 0.4);
            transition: all 0.3s;
            backdrop-filter: blur(10px);
        }
        .vulnerability:hover { 
            box-shadow: 0 12px 40px rgba(6, 182, 212, 0.2); 
            transform: translateY(-2px);
        }
        .vuln-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 20px; 
            flex-wrap: wrap;
            gap: 10px;
        }
        .vuln-title { 
            font-size: 1.3rem; 
            font-weight: 600; 
            color: #f1f5f9;
        }
        .vuln-details { margin: 15px 0; }
        .vuln-details strong { color: #cbd5e1; }
        .code-block { 
            background: rgba(15, 23, 42, 0.8); 
            color: #f1f5f9; 
            padding: 20px; 
            border-radius: 12px; 
            overflow-x: auto; 
            margin: 15px 0;
            border-left: 4px solid #06b6d4;
            backdrop-filter: blur(10px);
        }
        .code-block.unsafe { 
            background: rgba(127, 29, 29, 0.4); 
            border-left-color: #dc2626; 
        }
        .code-block.safe { 
            background: rgba(20, 83, 45, 0.4); 
            border-left-color: #16a34a; 
        }
        .code-block pre { 
            margin: 0; 
            font-family: 'Courier New', monospace; 
            font-size: 0.9rem;
            line-height: 1.4;
        }
        .no-vulnerabilities { 
            text-align: center; 
            padding: 60px 20px; 
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
            border-radius: 16px;
            margin: 20px 0;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .no-vulnerabilities h3 { 
            color: #6ee7b7; 
            font-size: 1.5rem; 
            margin-bottom: 10px; 
        }
        .footer { 
            background: rgba(51, 65, 85, 0.6); 
            padding: 30px; 
            text-align: center; 
            border-top: 1px solid rgba(6, 182, 212, 0.3);
            color: #94a3b8;
            backdrop-filter: blur(10px);
        }
        .export-info {
            background: rgba(6, 182, 212, 0.1);
            padding: 15px;
            border-radius: 12px;
            margin-top: 20px;
            font-size: 0.9rem;
            color: #67e8f9;
            border: 1px solid rgba(6, 182, 212, 0.3);
        }
        @media (max-width: 768px) {
            .header h1 { font-size: 2rem; }
            .content { padding: 20px; }
            .vuln-header { flex-direction: column; align-items: flex-start; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ Guardian Code Scan Report</h1>
            <p>Advanced Static Application Security Testing Results</p>
        </div>
        
        <div class="content">
            <div class="meta-info">
                <h3 style="margin-bottom: 15px; color: #06b6d4;">📋 Scan Information</h3>
                <p><strong>File:</strong> ${result.fileName}</p>
                <p><strong>Scan Date:</strong> ${new Date(result.timestamp).toLocaleString()}</p>
                <p><strong>Scan ID:</strong> ${result.id}</p>
                <p><strong>Total Vulnerabilities:</strong> ${result.summary.total}</p>
            </div>
            
            <div class="summary">
                <div class="stat-card total">
                    <h3>${result.summary.total}</h3>
                    <p>Total Issues</p>
                </div>
            </div>

            <div class="vulnerabilities">
                <h2>🔍 Detailed Vulnerability Analysis</h2>
                
                ${result.vulnerabilities.length === 0 ? `
                    <div class="no-vulnerabilities">
                        <h3>✅ No Vulnerabilities Found!</h3>
                        <p>Your code appears to be secure based on our analysis. Great job!</p>
                    </div>
                ` : result.vulnerabilities.map((vuln, index) => `
                    <div class="vulnerability">
                        <div class="vuln-header">
                            <div class="vuln-title">${index + 1}. ${vuln.type}</div>
                        </div>
                        
                        <div class="vuln-details">
                            <p><strong>📍 Location:</strong> ${vuln.fileName} (Line ${vuln.lineNumber})</p>
                            <p><strong>🏷️ Category:</strong> ${vuln.category}</p>
                            <p><strong>📝 Description:</strong> ${vuln.description}</p>
                        </div>

                        <div style="margin: 20px 0;">
                            <strong>🔍 Detailed Explanation:</strong>
                            <p style="margin-top: 8px; color: #cbd5e1;">${vuln.explanation}</p>
                        </div>

                        <div style="margin: 20px 0;">
                            <strong>⚠️ Vulnerable Code:</strong>
                            <div class="code-block unsafe">
                                <pre><code>${vuln.unsafeCode}</code></pre>
                            </div>
                        </div>

                        <div style="margin: 20px 0;">
                            <strong>✅ Secure Alternative:</strong>
                            <div class="code-block safe">
                                <pre><code>${vuln.safeCode}</code></pre>
                            </div>
                        </div>

                        <div style="margin: 20px 0;">
                            <strong>🛠️ Recommended Mitigation:</strong>
                            <p style="margin-top: 8px; color: #cbd5e1; background: rgba(6, 182, 212, 0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #06b6d4;">${vuln.mitigation}</p>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="export-info">
                <strong>📊 Report Information:</strong><br>
                Generated by Guardian Code Scan v1.0.0 on ${new Date().toLocaleString()}<br>
                This report contains ${result.vulnerabilities.length} security findings.
            </div>
        </div>

        <div class="footer">
            <p>🛡️ Guardian Code Scan - Advanced Static Application Security Testing</p>
            <p>Report generated on ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>`;

    const dataBlob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `guardian-scan-report-${result.fileName.replace(/[^a-zA-Z0-9]/g, '_')}-${result.id}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-3 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-xl transition-all duration-300 border border-cyan-400/20 hover:border-cyan-400/40 shadow-lg hover:shadow-cyan-400/20 transform hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Scanner
        </button>
        
        <div className="flex gap-3">
          <button
            onClick={exportToJSON}
            className="flex items-center gap-3 px-6 py-3 bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300 rounded-xl border border-cyan-400/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/20 transform hover:scale-105"
          >
            <FileDown className="w-5 h-5" />
            Export JSON
          </button>
          <button
            onClick={exportToHTML}
            className="flex items-center gap-3 px-6 py-3 bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300 rounded-xl border border-cyan-400/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/20 transform hover:scale-105"
          >
            <Download className="w-5 h-5" />
            Export HTML
          </button>
        </div>
      </div>

      {/* Scan Summary */}
      <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-cyan-400/30 shadow-2xl shadow-cyan-400/10 relative overflow-hidden group hover:shadow-cyan-400/20 transition-all duration-500">
        {/* Animated Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-indigo-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-cyan-400/20 via-blue-400/20 to-indigo-400/20 rounded-xl border border-cyan-400/40 shadow-xl shadow-cyan-400/20 backdrop-blur-sm animate-pulse">
              <TrendingUp className="w-6 h-6 text-cyan-300" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Scan Results
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-700/40 to-slate-600/40 rounded-xl p-6 border border-cyan-400/20 shadow-xl shadow-cyan-400/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-cyan-300">{result.summary.total}</div>
              <div className="text-slate-300 font-semibold">Total Vulnerabilities Found</div>
            </div>
          </div>
          
          <div className="text-slate-300 bg-slate-700/30 rounded-xl p-6 border border-cyan-400/20 backdrop-blur-sm">
            <p className="mb-2"><strong className="text-cyan-300">File:</strong> {result.fileName}</p>
            <p><strong className="text-cyan-300">Scan completed:</strong> {new Date(result.timestamp).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Vulnerability Charts */}
      <VulnerabilityChart result={result} />

      {/* Vulnerabilities List */}
      <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-cyan-400/30 shadow-2xl shadow-cyan-400/10 relative overflow-hidden group hover:shadow-cyan-400/20 transition-all duration-500">
        {/* Animated Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-indigo-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-6">
            Vulnerabilities Found
          </h3>
          
          {result.vulnerabilities.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-8 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-2xl border border-emerald-400/30 mb-6 inline-block shadow-xl shadow-emerald-400/10 backdrop-blur-sm">
                <Shield className="w-20 h-20 text-emerald-400 mx-auto animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-3">No Vulnerabilities Found!</h3>
              <p className="text-slate-300 text-lg">Your code looks secure based on our analysis.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {result.vulnerabilities.map((vuln) => (
                <div
                  key={vuln.id}
                  className="bg-gradient-to-r from-slate-700/40 to-slate-600/40 rounded-xl p-6 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/20 backdrop-blur-sm transform hover:scale-102"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-slate-400 text-sm font-semibold">Line {vuln.lineNumber}</span>
                      </div>
                      <h4 className="font-bold text-slate-200 mb-2 text-lg">{vuln.type}</h4>
                      <p className="text-slate-300 text-sm mb-4 leading-relaxed">{vuln.description}</p>
                      <div className="bg-slate-800/50 rounded-lg p-4 font-mono text-sm text-slate-300 border border-cyan-400/20 backdrop-blur-sm">
                        {vuln.unsafeCode}
                      </div>
                      <p className="text-slate-400 text-sm mt-4 leading-relaxed">{vuln.mitigation}</p>
                    </div>
                    <button
                      onClick={() => setSelectedVulnerability(vuln)}
                      className="ml-6 p-3 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 rounded-xl transition-all duration-300 border border-cyan-400/20 hover:border-cyan-400/40 hover:shadow-xl hover:shadow-cyan-400/20 transform hover:scale-110"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vulnerability Modal */}
      {selectedVulnerability && (
        <VulnerabilityModal
          vulnerability={selectedVulnerability}
          onClose={() => setSelectedVulnerability(null)}
        />
      )}
    </div>
  );
};