import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="shrink-0">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-(--primary-500) to-(--primary-700)">
          <span className="text-xl font-bold text-white">E</span>
        </div>
        <span className="hidden text-xl font-bold text-(--gray-900) sm:block">
          EcoShop
        </span>
      </div>
    </Link>
  );
}
