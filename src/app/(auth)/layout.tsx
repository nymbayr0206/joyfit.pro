import { AppHeader } from "@/components/AppHeader";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-gray-50)] flex flex-col">
      <AppHeader />
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
