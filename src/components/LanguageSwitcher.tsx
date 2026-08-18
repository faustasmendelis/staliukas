"use client";

import { useParams, usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1 bg-muted-bg rounded-full p-0.5">
      <button
        onClick={() => switchLocale("lt")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          locale === "lt"
            ? "bg-primary text-white"
            : "text-muted hover:text-foreground"
        }`}
      >
        LT
      </button>
      <button
        onClick={() => switchLocale("en")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          locale === "en"
            ? "bg-primary text-white"
            : "text-muted hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );
}
