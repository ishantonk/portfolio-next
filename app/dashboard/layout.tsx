export const metadata = { title: "Dashboard — Ishan Tonk Portfolio" };

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return <div className="min-h-screen bg-bg text-ink">{children}</div>;
}
