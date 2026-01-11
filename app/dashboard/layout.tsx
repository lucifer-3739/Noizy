import { MusicSidebar } from "@/components/dashboard/DashboardSidebar";
import MobileSidebar from "@/components/dashboard/MobileSidebar";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="relative flex h-screen overflow-hidden bg-black">
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden md:flex flex-col w-64 h-full border-r border-white/10 fixed left-0 top-0 bottom-0 z-40 bg-[#0a0a0a]">
        <MusicSidebar className="w-full h-full" />
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <MobileSidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 h-full overflow-y-auto relative w-full">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
