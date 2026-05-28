'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileSearch, History, LogOut, ShieldCheck } from 'lucide-react';

const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Forensic Audit', icon: FileSearch, href: '/dashboard/audit' },
    { name: 'History', icon: History, href: '/dashboard/history' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-slate-950 p-6 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-3 mb-10 px-2">
                    <ShieldCheck className="text-emerald-500 w-6 h-6" />
                    <span className="font-bold tracking-widest text-white text-sm">V.A.U.L.T</span>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-500 hover:text-slate-200'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <button className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Terminate Session</span>
            </button>
        </aside>
    );
}