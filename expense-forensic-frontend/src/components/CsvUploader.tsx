'use client';

import { useState, useRef } from 'react';
import { FileUp, FileCheck, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function CsvUploader({ onUploadSuccess }: { onUploadSuccess: () => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();

            // We use FormData for file uploads
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('http://localhost:4000/expenses/ingest/csv', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`
                    // Note: Do NOT set Content-Type header when sending FormData; 
                    // the browser will set it automatically with the boundary string.
                },
                body: formData
            });

            if (!res.ok) throw new Error('Bulk forensic analysis failed');

            const result = await res.json();
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';

            onUploadSuccess();
            alert(`Success: ${result.count} transactions identified and logged.`);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <FileUp className="text-blue-500 w-5 h-5" />
                <h3 className="text-white font-bold tracking-tight">Bulk Audit: CSV Upload</h3>
            </div>

            <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-950'
                    }`}
            >
                <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />

                {file ? (
                    <>
                        <FileCheck className="text-emerald-500 w-10 h-10 mb-2" />
                        <p className="text-emerald-400 text-sm font-medium">{file.name}</p>
                        <p className="text-slate-500 text-xs mt-1">Ready for forensic processing</p>
                    </>
                ) : (
                    <>
                        <FileUp className="text-slate-600 w-10 h-10 mb-2" />
                        <p className="text-slate-400 text-sm">Click to select bank statement</p>
                        <p className="text-slate-600 text-xs mt-1">Supported: .CSV files only</p>
                    </>
                )}
            </div>

            <button
                onClick={handleUpload}
                disabled={uploading || !file}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
                {uploading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                    'Run Bulk Analysis'
                )}
            </button>
        </div>
    );
}