import { MusicSidebar } from "@/components/dashboard/DashboardSidebar";
import { PlayerProvider } from "@/components/dashboard/player-context";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex">
      <MusicSidebar />
      <main className="flex-1">
        <PlayerProvider>{children}</PlayerProvider>
      </main>
    </div>
  );
};

export default DashboardLayout;
