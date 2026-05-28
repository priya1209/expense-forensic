'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, Loader2 } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.push('/dashboard'); // Redirect to your dashboard route
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">

                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-emerald-500/10 p-3 rounded-xl mb-4">
                        <ShieldCheck className="text-emerald-500 w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        {isSignUp ? 'Create Agent Account' : 'Forensic Login'}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {isSignUp ? 'Initialize your secure vault' : 'Enter your credentials to access data'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                            <input
                                required
                                type="email"
                                placeholder="agent@forensic.ai"
                                className="w-full pl-10 p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Passcode</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                            <input
                                required
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-10 p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold py-3 rounded-lg mt-4 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (isSignUp ? 'Register' : 'Access Vault')}
                    </button>
                </form>

                {/* Toggle between Login/Signup */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-slate-400 text-sm hover:text-emerald-400 transition-colors underline underline-offset-4"
                    >
                        {isSignUp ? 'Already have access? Login' : 'Need a new vault? Register here'}
                    </button>
                </div>
            </div>
        </div>
    );
}