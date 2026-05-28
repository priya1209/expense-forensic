'use client';
import { useEffect, useState } from 'react';
import { DollarSign, AlertTriangle, Activity } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import SmsIngester from '@/src/components/SmsIngester';
import CsvUploader from '@/src/components/CsvUploader';


export default function DashboardPage() {
    const [analysis, setAnalysis] = useState<any>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Function to re-fetch data after a successful upload
    const handleSuccess = () => setRefreshTrigger(prev => prev + 1);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            console.log('🔐 Frontend session:', session ? 'FOUND' : 'NOT FOUND');
            if (!session) return;

            console.log('🔑 Token length:', session.access_token.length);
            console.log('📡 Making request to: http://localhost:2020/expenses/analysis');

            const res = await fetch('http://localhost:2020/expenses/analysis', {
                headers: { Authorization: `Bearer ${session.access_token}` }
            });

            console.log('📊 Response status:', res.status);
            const data = await res.json();
            console.log('📊 Response data:', data);
            setAnalysis(data);
        };
        fetchData();
    }, [refreshTrigger]); // 2. Add refreshTrigger here to update UI on upload

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Forensic Overview</h1>

            {/* 1. Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard
                    title="Total Spent"
                    value={`$${analysis?.totalSpent || '0.00'}`}
                    icon={<DollarSign className="text-emerald-500" />}
                />
                <SummaryCard
                    title="Audit Status"
                    value={analysis?.status || 'Scanning...'}
                    icon={<Activity className="text-blue-500" />}
                />
                <SummaryCard
                    title="Detected Leaks"
                    value={analysis?.potentialLeaks?.length || 0}
                    icon={<AlertTriangle className="text-red-500" />}
                />
            </div>

            {/* 3. NEW: Ingestion Grid (Added here) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SmsIngester onUploadSuccess={handleSuccess} />
                <CsvUploader onUploadSuccess={handleSuccess} />
            </div>

            {/* 2. Detailed Findings Area */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl min-h-[300px]">
                <h2 className="text-slate-400 font-medium mb-4">Recent Findings</h2>
                {analysis?.potentialLeaks?.length > 0 ? (
                    <ul className="space-y-2">
                        {analysis.potentialLeaks.map((leak: string, i: number) => (
                            <li key={i} className="text-red-400 text-sm flex items-center gap-2">
                                <AlertTriangle size={14} /> {leak}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-600 italic text-sm">No suspicious leaks detected in current cycle.</p>
                )}
            </div>
        </div>
    );
}

function SummaryCard({ title, value, icon }: any) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex justify-between items-start">
                <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</span>
                {icon}
            </div>
            <div className="text-2xl font-bold text-white mt-2 tracking-tight">{value}</div>
        </div>
    );
}