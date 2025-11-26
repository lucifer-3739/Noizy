import { MusicSidebar } from "@/components/dashboard/DashboardSidebar";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex">
      <MusicSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default DashboardLayout;
