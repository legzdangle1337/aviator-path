import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-surface">
      <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 lg:px-8">
        <a href="/" className="flex items-center gap-1 text-xl font-bold">
          <span className="text-gold">✈</span>
          <span className="text-navy">Aviator Path</span>
        </a>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
          <button
            onClick={signOut}
            className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-navy mb-4">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your Aviator Path dashboard. More features coming soon.</p>
      </main>
    </div>
  );
}
