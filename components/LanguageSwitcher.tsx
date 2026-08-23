"use client";

import { usePathname } from "next/navigation";
import styles from "./LanguageSwitcher.module.css";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");

  // English pages already provide a visible “中文” link in their own header.
  if (isEnglish) return null;

  return (
    <a
      className={styles.switcher}
      href="/en"
      hrefLang="en"
      lang="en"
      translate="no"
      aria-label="Switch to the English site"
      title="Switch to English"
    >
      <svg className={styles.globe} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.8 12h16.4M12 3.5c2.15 2.25 3.25 5.08 3.25 8.5S14.15 18.25 12 20.5M12 3.5C9.85 5.75 8.75 8.58 8.75 12s1.1 6.25 3.25 8.5" />
      </svg>
      <span className={styles.label}>English</span>
      <svg className={styles.chevron} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="m6 3.75 4.25 4.25L6 12.25" />
      </svg>
    </a>
  );
}
