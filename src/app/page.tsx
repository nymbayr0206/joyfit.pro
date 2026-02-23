import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md space-y-6">
        <img
          src="/logo.png"
          alt="JOYFIT"
          className="mx-auto w-40 max-w-[160px] h-auto"
          width={160}
          height={80}
        />
        <p className="text-[var(--color-charcoal-soft)] text-sm uppercase tracking-wide">
          ЖАРГАЛТАЙГААР ГАЛБИРЖ
        </p>
        <Link
          href="/checkup"
          className="btn-primary inline-block rounded-2xl px-8 py-4 text-lg"
        >
          Үнэгүй жингийн төлөвлөгөө авах
        </Link>
        <p className="pt-4 text-sm text-[var(--color-gray-500)]">
          <Link href="/login" className="underline">Нэвтрэх</Link>
        </p>
      </div>
    </main>
  );
}
