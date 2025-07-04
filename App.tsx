import React, { useState } from 'react';
import { Shield, Code, Zap, Eye, Lock, FileSearch, TrendingUp, CheckCircle, AlertTriangle, Users, Globe, Award, Cpu, Database, Cloud } from 'lucide-react';
import { ScanHistory } from './components/ScanHistory';
import { CodeInput } from './components/CodeInput';
import { ScanResults } from './components/ScanResults';
import { VulnerabilityDetector } from './utils/vulnerabilityDetector';
import { ScanResult, ScanHistory as ScanHistoryType } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'scanner' | 'results'>('scanner');
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryType[]>([
    {
      id: '1',
      timestamp: 'Jul 2, 2025 3:22 PM',
      fileName: 'app.js',
      vulnerabilityCount: 3,
      summary: '3 vulnerabilities: The code has 3 identified vulnerabilities...',
      result: {
        id: '1',
        timestamp: new Date('2025-07-02T15:22:00'),
        fileName: 'app.js',
        totalLines: 50,
        vulnerabilities: [
          {
            id: '1-1',
            fileName: 'app.js',
            lineNumber: 15,
            type: 'Dynamic Code Execution',
            description: 'Use of eval() function allows arbitrary code execution',
            mitigation: 'Avoid using eval(). Use JSON.parse() for JSON data or implement proper parsing.',
            unsafeCode: 'eval(userInput);',
            safeCode: 'JSON.parse(userInput); // For JSON data',
            explanation: 'Dynamic code execution vulnerabilities occur when user input is directly executed as code.',
            category: 'Code Injection'
          },
          {
            id: '1-2',
            fileName: 'app.js',
            lineNumber: 23,
            type: 'Cross-Site Scripting (XSS)',
            description: 'Dynamic HTML generation without proper sanitization',
            mitigation: 'Use textContent instead of innerHTML or properly sanitize user input.',
            unsafeCode: 'element.innerHTML = userInput;',
            safeCode: 'element.textContent = userInput;',
            explanation: 'XSS vulnerabilities allow attackers to inject malicious scripts into web pages.',
            category: 'Cross-Site Scripting'
          },
          {
            id: '1-3',
            fileName: 'app.js',
            lineNumber: 31,
            type: 'Insecure Randomness',
            description: 'Math.random() is not cryptographically secure',
            mitigation: 'Use crypto.randomBytes() or crypto.getRandomValues() for security purposes.',
            unsafeCode: 'const token = Math.random().toString(36);',
            safeCode: 'const crypto = require("crypto");\nconst token = crypto.randomBytes(32).toString("hex");',
            explanation: 'Using predictable random number generators for security purposes can lead to cryptographic weaknesses.',
            category: 'Cryptography'
          }
        ],
        summary: { total: 3 },
        codeMetrics: {
          cleanLines: 47,
          vulnerableLines: 3,
          codeHealthPercentage: 94
        }
      }
    },
    {
      id: '2',
      timestamp: 'Jul 2, 2025 3:21 PM',
      fileName: 'auth.py',
      vulnerabilityCount: 9,
      summary: '9 vulnerabilities: The code has 9 vulnerabilities, including...',
      result: {
        id: '2',
        timestamp: new Date('2025-07-02T15:21:00'),
        fileName: 'auth.py',
        totalLines: 120,
        vulnerabilities: [
          {
            id: '2-1',
            fileName: 'auth.py',
            lineNumber: 8,
            type: 'Hardcoded Credentials',
            description: 'Hardcoded passwords found in source code',
            mitigation: 'Use environment variables or secure configuration files for credentials.',
            unsafeCode: 'password = "admin123"',
            safeCode: 'password = os.environ.get("PASSWORD")',
            explanation: 'Hardcoded credentials in source code pose significant security risks.',
            category: 'Sensitive Data'
          }
        ],
        summary: { total: 9 },
        codeMetrics: {
          cleanLines: 111,
          vulnerableLines: 9,
          codeHealthPercentage: 92
        }
      }
    }
  ]);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async (code: string, fileName: string) => {
    setIsScanning(true);
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const vulnerabilities = VulnerabilityDetector.detectVulnerabilities(code, fileName);
    const codeMetrics = VulnerabilityDetector.calculateCodeMetrics(code, vulnerabilities);
    
    const result: ScanResult = {
      id: Date.now().toString(),
      timestamp: new Date(),
      fileName,
      vulnerabilities,
      summary: {
        total: vulnerabilities.length
      },
      totalLines: codeMetrics.totalLines,
      codeMetrics
    };

    // Add to history
    const historyEntry: ScanHistoryType = {
      id: result.id,
      timestamp: new Date().toLocaleString(),
      fileName,
      vulnerabilityCount: vulnerabilities.length,
      summary: `${vulnerabilities.length} vulnerabilities: ${
        vulnerabilities.length > 0 
          ? `Found various security issues in the code`
          : 'No security issues detected in the code'
      }`,
      result
    };

    setScanHistory(prev => [historyEntry, ...prev]);
    setCurrentResult(result);
    setCurrentView('results');
    setIsScanning(false);
  };

  const handleViewScan = (scanId: string) => {
    const scan = scanHistory.find(s => s.id === scanId);
    if (scan && scan.result) {
      setCurrentResult(scan.result);
      setCurrentView('results');
    }
  };

  const handleDeleteScan = (scanId: string) => {
    setScanHistory(prev => prev.filter(scan => scan.id !== scanId));
  };

  const handleClearHistory = () => {
    setScanHistory([]);
  };

  const handleBackToScanner = () => {
    setCurrentView('scanner');
    setCurrentResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 bg-slate-800/30 backdrop-blur-xl border-b border-blue-400/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-400/20 via-cyan-400/20 to-indigo-400/20 rounded-2xl border border-blue-400/40 shadow-2xl shadow-blue-400/20 backdrop-blur-sm animate-glow">
                <Shield className="w-12 h-12 text-cyan-300 drop-shadow-lg" />
              </div>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent mb-4 drop-shadow-2xl animate-shimmer">
              Guardian Code Scan
            </h1>
            <p className="text-slate-300 text-xl max-w-2xl leading-relaxed drop-shadow-lg mb-8">
              Advanced Static Application Security Testing. Detect vulnerabilities with precision.
            </p>
          </div>
        </div>
      </header>

      {/* Application Information Section */}
      {currentView === 'scanner' && (
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-cyan-400/30 shadow-2xl shadow-cyan-400/10 relative overflow-hidden group hover:shadow-cyan-400/20 transition-all duration-500 mb-8">
            {/* Animated Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-indigo-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-6">
                  What Guardian Code Scan Detects
                </h2>
                <p className="text-slate-300 text-lg max-w-4xl mx-auto leading-relaxed">
                  Our advanced SAST engine analyzes your code for critical security vulnerabilities across multiple programming languages, 
                  providing detailed remediation guidance and secure coding alternatives.
                </p>
              </div>

              {/* Vulnerability Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl p-6 shadow-xl shadow-red-400/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                    <h3 className="text-xl font-bold text-red-300">Critical Vulnerabilities</h3>
                  </div>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li>• Dynamic Code Execution (eval, exec)</li>
                    <li>• SQL Injection Patterns</li>
                    <li>• Command Injection</li>
                    <li>• Hardcoded Credentials</li>
                    <li>• Path Traversal Attacks</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-xl p-6 shadow-xl shadow-amber-400/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="w-8 h-8 text-amber-400" />
                    <h3 className="text-xl font-bold text-amber-300">Security Issues</h3>
                  </div>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li>• Cross-Site Scripting (XSS)</li>
                    <li>• Missing Input Validation</li>
                    <li>• Unvalidated Redirects</li>
                    <li>• Insecure File Operations</li>
                    <li>• Authentication Bypasses</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-xl p-6 shadow-xl shadow-cyan-400/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-8 h-8 text-cyan-400" />
                    <h3 className="text-xl font-bold text-cyan-300">Code Quality Concerns</h3>
                  </div>
                  <ul className="text-slate-300 space-y-2 text-sm">
                    <li>• Insecure Randomness</li>
                    <li>• Information Disclosure</li>
                    <li>• Weak Cryptography</li>
                    <li>• Configuration Issues</li>
                    <li>• Code Quality Problems</li>
                  </ul>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-gradient-to-br from-slate-700/40 to-slate-600/40 rounded-xl p-6 border border-cyan-400/20 shadow-xl shadow-cyan-400/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <Code className="w-6 h-6 text-cyan-400" />
                    <h4 className="font-bold text-slate-200">Multi-Language</h4>
                  </div>
                  <p className="text-slate-300 text-sm">JavaScript, Python, TypeScript support with extensible pattern engine</p>
                </div>

                <div className="bg-gradient-to-br from-slate-700/40 to-slate-600/40 rounded-xl p-6 border border-cyan-400/20 shadow-xl shadow-cyan-400/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-6 h-6 text-cyan-400" />
                    <h4 className="font-bold text-slate-200">Real-Time Analysis</h4>
                  </div>
                  <p className="text-slate-300 text-sm">Instant vulnerability detection with detailed line-by-line analysis</p>
                </div>

                <div className="bg-gradient-to-br from-slate-700/40 to-slate-600/40 rounded-xl p-6 border border-cyan-400/20 shadow-xl shadow-cyan-400/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <FileSearch className="w-6 h-6 text-cyan-400" />
                    <h4 className="font-bold text-slate-200">Detailed Reports</h4>
                  </div>
                  <p className="text-slate-300 text-sm">Comprehensive reports with remediation guidance and secure alternatives</p>
                </div>

                <div className="bg-gradient-to-br from-slate-700/40 to-slate-600/40 rounded-xl p-6 border border-cyan-400/20 shadow-xl shadow-cyan-400/10 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-6 h-6 text-cyan-400" />
                    <h4 className="font-bold text-slate-200">Privacy First</h4>
                  </div>
                  <p className="text-slate-300 text-sm">Client-side processing ensures your code never leaves your browser</p>
                </div>
              </div>

              {/* Technical Architecture */}
              <div className="bg-gradient-to-br from-slate-700/30 to-slate-600/30 rounded-xl p-8 border border-cyan-400/20 shadow-xl shadow-cyan-400/10 backdrop-blur-sm">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-6 text-center">
                  Advanced Technical Architecture
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="p-4 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-xl border border-cyan-400/30 shadow-xl shadow-cyan-400/10 mb-4 inline-block">
                      <Cpu className="w-8 h-8 text-cyan-300" />
                    </div>
                    <h4 className="font-bold text-slate-200 mb-2">Pattern Matching Engine</h4>
                    <p className="text-slate-300 text-sm">Advanced regex-based vulnerability detection with 15+ security patterns</p>
                  </div>
                  <div className="text-center">
                    <div className="p-4 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-xl border border-cyan-400/30 shadow-xl shadow-cyan-400/10 mb-4 inline-block">
                      <Database className="w-8 h-8 text-cyan-300" />
                    </div>
                    <h4 className="font-bold text-slate-200 mb-2">Client-Side Processing</h4>
                    <p className="text-slate-300 text-sm">React-based frontend with TypeScript for type-safe vulnerability analysis</p>
                  </div>
                  <div className="text-center">
                    <div className="p-4 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-xl border border-cyan-400/30 shadow-xl shadow-cyan-400/10 mb-4 inline-block">
                      <TrendingUp className="w-8 h-8 text-cyan-300" />
                    </div>
                    <h4 className="font-bold text-slate-200 mb-2">Intelligent Analysis</h4>
                    <p className="text-slate-300 text-sm">Comprehensive vulnerability classification with detailed remediation guidance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'scanner' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Scan History - Left Panel */}
            <div className="lg:col-span-1">
              <ScanHistory
                history={scanHistory}
                onViewScan={handleViewScan}
                onDeleteScan={handleDeleteScan}
                onClearHistory={handleClearHistory}
              />
            </div>

            {/* Code Input - Right Panel */}
            <div className="lg:col-span-2">
              <CodeInput onScan={handleScan} isScanning={isScanning} />
            </div>
          </div>
        ) : (
          currentResult && (
            <ScanResults result={currentResult} onBack={handleBackToScanner} />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-800/20 border-t border-blue-400/20 mt-16 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-slate-400">
            <p>&copy; 2025 Guardian Code Scan. Built with security in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;