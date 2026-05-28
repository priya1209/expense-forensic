"use client"

import Sidebar from "@/src/components/Sidebar";
import { supabase } from "@/src/lib/supabase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // No session? Kick them back to login
                router.push('/login');
            }
        };
        checkUser();
    }, []);

    return (
        <div className="flex h-screen bg-slate-950">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                {children} {/* This is where page.tsx content will appear */}
            </main>
        </div>
    );
}