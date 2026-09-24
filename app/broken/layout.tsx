import Link from "next/link";

export default function BrokenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to sandbox
        </Link>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/broken/checkout/" className="hover:text-foreground">Checkout</Link>
          <Link href="/broken/dashboard/" className="hover:text-foreground">Dashboard</Link>
          <Link href="/broken/settings/" className="hover:text-foreground">Settings</Link>
        </nav>
      </div>
      <p className="mb-8 rounded-lg border border-amber-400/20 bg-amber-400/[0.04] px-4 py-3 text-sm text-muted-foreground">
        This page is broken on purpose. Find something wrong and report it with the Feedback button.
      </p>
      {children}
    </div>
  );
}
