'use client';

import { useState } from 'react';
import { Zap, Loader2, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SmsIngester({ onUploadSuccess }: { onUploadSuccess: () => void }) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleIngest = async () => {
        if (!text.trim()) return;
        setLoading(true);

        try {
            // 1. Get the JWT token from Supabase
            const { data: { session } } = await supabase.auth.getSession();

            // 2. Send to your NestJS backend
            const res = await fetch('http://localhost:2020/expenses/ingest/sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ rawText: text })
            });

            if (!res.ok) throw new Error('Forensic analysis failed');

            // 3. Clear and Refresh
            setText('');
            onUploadSuccess(); // This triggers the dashboard cards to update
            alert("Analysis Complete: Entry categorized and secured.");
        } catch (err: any) {
            console.log(err, "daefaed");

            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <Search className="text-emerald-500 w-5 h-5" />
                <h3 className="text-white font-bold tracking-tight">AI Forensics: Smart Ingest</h3>
            </div>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste transaction SMS here (e.g., 'Spent $42.50 at Zomato'...)"
                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-emerald-100/70 focus:ring-1 focus:ring-emerald-500 outline-none resize-none transition-all placeholder:text-slate-700"
            />

            <button
                onClick={handleIngest}
                disabled={loading || !text}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
                {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                    <>
                        <Zap size={16} className="fill-current" />
                        Analyze Transaction
                    </>
                )}
            </button>
        </div>
    );
}