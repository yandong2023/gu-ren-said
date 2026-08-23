"use client";

import { usePathname } from "next/navigation";
import styles from "./LanguageSwitcher.module.css";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");

  return (
    <a
      className={styles.switcher}
      href={isEnglish ? "/" : "/en"}
      hrefLang={isEnglish ? "zh-CN" : "en"}
      aria-label={isEnglish ? "Switch to the Chinese site" : "Switch to the English site"}
    >
      <span aria-hidden="true">{isEnglish ? "中" : "EN"}</span>
      <strong>{isEnglish ? "中文" : "English"}</strong>
    </a>
  );
}
