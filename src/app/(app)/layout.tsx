import Sidebar from '@/components/app/Sidebar';
import Navbar from '@/components/app/Navbar';

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen font-poppins text-black bg-white">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
