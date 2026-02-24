import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";

export default async function WeighInPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold text-[var(--color-charcoal)] mb-2">
          Жингийн бүртгэл
        </h1>
        <p className="text-[var(--color-gray-600)] mb-6">
          Record your weekly weigh-ins and track your progress.
        </p>
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-[var(--color-gray-100)] rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">⚖️</span>
          </div>
          <h2 className="text-lg font-semibold text-[var(--color-charcoal)] mb-2">
            Coming Soon
          </h2>
          <p className="text-sm text-[var(--color-gray-600)]">
            This feature is currently locked and will be available after payment approval.
          </p>
        </div>
      </div>
    </div>
  );
}
