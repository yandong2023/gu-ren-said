"use client";

import { usePathname } from "next/navigation";
import styles from "./LanguageSwitcher.module.css";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");

  // English pages already expose a visible “中文” link in their own header.
  // Keep this global switcher for the Chinese site only, where it also covers
  // query, hot and Chengyu pages that do not share the English navigation.
  if (isEnglish) return null;

  return (
    <a
      className={styles.switcher}
      href="/en"
      hrefLang="en"
      lang="en"
      aria-label="Switch to the English site"
    >
      <span aria-hidden="true">EN</span>
      <strong>English</strong>
    </a>
  );
}
