import Sidebar from "@/src/components/Sidebar";


export default function Home({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 border-l border-slate-900">
        {children}
      </main>
    </div>
  );
}