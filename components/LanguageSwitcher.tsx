"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./LanguageSwitcher.module.css";

type LanguageCode = "zh-CN" | "en";

type LanguageOption = {
  code: LanguageCode;
  label: string;
  description: string;
  href: string;
};

const LANGUAGES: LanguageOption[] = [
  { code: "zh-CN", label: "中文", description: "简体中文", href: "/" },
  { code: "en", label: "English", description: "English", href: "/en" }
];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const currentCode: LanguageCode = isEnglish ? "en" : "zh-CN";
  const currentLabel = isEnglish ? "English" : "中文";
  const menuLabel = isEnglish ? "Language" : "选择语言";
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        className={`${styles.trigger} ${open ? styles.triggerOpen : ""}`}
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={isEnglish ? "Choose language" : "选择语言"}
        onClick={() => setOpen((value) => !value)}
      >
        <svg className={styles.globe} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.8 12h16.4M12 3.5c2.15 2.25 3.25 5.08 3.25 8.5S14.15 18.25 12 20.5M12 3.5C9.85 5.75 8.75 8.58 8.75 12s1.1 6.25 3.25 8.5" />
        </svg>
        <span className={styles.label} translate="no">{currentLabel}</span>
        <svg className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="m3.75 6 4.25 4.25L12.25 6" />
        </svg>
      </button>

      {open ? (
        <div className={styles.menu} id={menuId} role="menu" aria-label={menuLabel}>
          <div className={styles.menuLabel}>{menuLabel}</div>
          {LANGUAGES.map((option) => {
            const current = option.code === currentCode;
            const content = (
              <>
                <span className={styles.optionText}>
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </span>
                {current ? (
                  <svg className={styles.check} viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="m3.25 8.2 3 3 6.5-6.5" />
                  </svg>
                ) : null}
              </>
            );

            if (current) {
              return (
                <span
                  className={`${styles.option} ${styles.optionCurrent}`}
                  role="menuitem"
                  aria-current="page"
                  lang={option.code}
                  key={option.code}
                >
                  {content}
                </span>
              );
            }

            return (
              <a
                className={styles.option}
                href={option.href}
                hrefLang={option.code}
                lang={option.code}
                role="menuitem"
                translate="no"
                onClick={() => setOpen(false)}
                key={option.code}
              >
                {content}
              </a>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
