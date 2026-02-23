import Link from "next/link";

interface AppHeaderProps {
  /** Optional right-side content (e.g. logout button) */
  children?: React.ReactNode;
}

export function AppHeader({ children }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-200 py-3 px-4">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-[var(--color-charcoal)]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <img
            src="/logo.png"
            alt="JOYFIT"
            className="h-9 w-auto"
            width={120}
            height={36}
          />
        </Link>
        {children}
      </div>
    </header>
  );
}
