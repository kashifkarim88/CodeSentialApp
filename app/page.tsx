"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
  Code2, Terminal, AlertTriangle, Info,
  CheckCircle2, Loader2, Copy, Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 1. Define the shape of the API response
interface AnalysisResult {
  status: string;
  vulnerability_type: string;
  cwe_id: string;
  owasp_category: string;
  explanation: string;
  secure_code: string;
}

export default function Home() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Tell State that 'result' can be the interface OR null
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!code) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("https://codesentinelapi-zqdk.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "code": code }),
      });

      if (!response.ok) throw new Error("Server error");
      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (error) {
      alert("Error connecting to server. Ensure your backend is live!");
    } finally {
      setLoading(false);
    }
  };

  // 3. Explicitly type 'text' as string
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const isSafe = result?.status === "safe";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg text-white">
              <Image
                src="/icon.png"
                alt="Code Sentinel"
                width={32}
                height={32}
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-3xl md:text-4xl tracking-tight text-slate-900">Code Sentinel</h1>
                <span className="hidden md:block h-6 w-[1px] bg-slate-300 mx-2"></span>
                <div className="flex flex-col">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-600 leading-none mb-1">Developed By</p>
                  <p className="text-sm font-bold text-slate-700 leading-none">Kashif Karim</p>
                </div>
              </div>
              <p className="text-slate-500 font-medium text-sm mt-1">AI-powered security vulnerability scanner</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Online
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Code Input */}
        <section className="flex flex-col space-y-4">
          <div className="flex items-center gap-2 text-slate-700">
            <Code2 size={20} />
            <h3 className="font-semibold uppercase text-xs tracking-wider">Input Source Code</h3>
          </div>
          <div className="relative group">
            <textarea
              className="w-full h-[550px] p-4 font-mono text-sm bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
              placeholder="Paste your Python code here to check for vulnerabilities..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              onClick={handleAnalyze}
              disabled={!code || loading}
              className="absolute bottom-6 right-6 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl active:scale-95 z-10"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Terminal size={20} />}
              {loading ? "Analyzing..." : "Analyze Security"}
            </button>
          </div>
        </section>

        {/* Right: Analysis Output */}
        <section className="flex flex-col space-y-4">
          <div className="flex items-center gap-2 text-slate-700">
            <Shield size={20} />
            <h3 className="font-semibold uppercase text-xs tracking-wider">Security Report</h3>
          </div>

          <div className="min-h-[550px] bg-white border border-slate-200 rounded-2xl shadow-sm p-6 overflow-auto">
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                  <div className="p-6 bg-slate-50 rounded-full mb-4">
                    <Shield size={64} className="text-slate-300" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-400">No Scan Active</h4>
                  <p className="max-w-[280px]">Enter your source code and click the button to generate a report.</p>
                </div>
              )}

              {loading && (
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                    <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-indigo-600 font-bold text-lg">Scanning Deeply...</p>
                    <p className="text-slate-400 text-sm">Identifying potential threats and CWE patterns</p>
                  </div>
                </div>
              )}

              {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* Status Banner */}
                  <div className={`flex items-center gap-4 p-5 rounded-xl border-2 ${isSafe ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-orange-50 border-orange-100 text-orange-800"}`}>
                    <div className={`p-2 rounded-lg ${isSafe ? 'bg-emerald-500' : 'bg-orange-500'} text-white`}>
                      {isSafe ? <CheckCircle2 size={28} /> : <AlertTriangle size={28} />}
                    </div>
                    <div>
                      <h4 className="font-black text-lg leading-tight">{result.vulnerability_type}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${isSafe ? 'bg-emerald-200 text-emerald-900' : 'bg-orange-200 text-orange-900'}`}>
                          {result.status}
                        </span>
                        <span className="text-xs font-medium text-slate-500 tracking-tight">Threat Level Detected</span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard label="CWE Identification" value={result.cwe_id} icon={<Terminal size={12} />} />
                    <StatCard label="OWASP Category" value={result.owasp_category} icon={<Shield size={12} />} />
                  </div>

                  {/* Explanation */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-3 font-bold text-sm text-slate-800 uppercase tracking-wide">
                      <Info size={16} className="text-indigo-500" /> Vulnerability Insights
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600 font-medium italic">"{result.explanation}"</p>
                  </div>

                  {/* Secure Code Block */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-800 uppercase tracking-wide">
                        <CheckCircle2 size={16} className="text-emerald-500" /> {isSafe ? "Standard Compliance" : "Recommended Secure Fix"}
                      </div>
                      <button
                        onClick={() => copyToClipboard(result.secure_code)}
                        className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Copy size={14} /> Copy Source
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap bg-slate-900 text-emerald-400 p-5 rounded-xl text-xs font-mono overflow-auto max-h-[300px] shadow-2xl border border-slate-800">
                      {result.secure_code.replace(/\\n/g, '\n')}
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
        &copy; 2026 Code Sentinel | Secure Analysis System | Developed by <span className="text-slate-600 font-bold">Kashif Karim</span>
      </footer>
    </div>
  );
}

// 4. Properly typed Sub-component props
interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-slate-400">{icon}</span>
        <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">{label}</p>
      </div>
      <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
    </div>
  );
}