import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Wallet, Settings } from "lucide-react";

const tabs = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function BottomTabs() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-3 text-xs font-medium text-muted-foreground transition-colors"
            activeProps={{ className: "text-primary" }}
          >
            <Icon className="h-6 w-6 shrink-0" />
            <span className="truncate">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="mx-auto w-full max-w-md px-5 pt-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
        <div className="mt-6 space-y-4">{children}</div>
      </div>
      <BottomTabs />
    </div>
  );
}
