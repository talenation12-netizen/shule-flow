export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="border-b p-3 text-sm font-medium">
        ShuleFlow Dashboard
      </div>

      <main className="p-4">{children}</main>
    </div>
  );
}