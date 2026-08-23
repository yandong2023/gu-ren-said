"use client";

import { usePathname } from "next/navigation";
import styles from "./LanguageSwitcher.module.css";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const href = isEnglish ? "/" : "/en";
  const label = isEnglish ? "中文" : "English";
  const hrefLang = isEnglish ? "zh-CN" : "en";
  const ariaLabel = isEnglish ? "切换到中文网站" : "Switch to the English site";
  const title = isEnglish ? "切换到中文" : "Switch to English";

  return (
    <a
      className={styles.switcher}
      href={href}
      hrefLang={hrefLang}
      lang={hrefLang}
      translate="no"
      aria-label={ariaLabel}
      title={title}
    >
      <svg className={styles.globe} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.8 12h16.4M12 3.5c2.15 2.25 3.25 5.08 3.25 8.5S14.15 18.25 12 20.5M12 3.5C9.85 5.75 8.75 8.58 8.75 12s1.1 6.25 3.25 8.5" />
      </svg>
      <span className={styles.label}>{label}</span>
      <svg className={styles.chevron} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="m6 3.75 4.25 4.25L6 12.25" />
      </svg>
    </a>
  );
}
