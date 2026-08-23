import LanguageSwitcher from "@/components/LanguageSwitcher";
import styles from "@/app/en/english.module.css";

type Props = {
  primaryHref?: string;
  primaryLabel?: string;
};

export default function EnglishNav({
  primaryHref = "/en#search",
  primaryLabel = "Find a line"
}: Props) {
  return (
    <nav className={styles.nav} aria-label="English navigation">
      <a className={styles.brand} href="/en">
        <span className={styles.brandSeal} lang="zh-CN">古</span>
        <span>Gu Ren Said</span>
      </a>
      <div className={styles.navLinks}>
        <a className={styles.navLink} href="/en/explore">Explore</a>
        <LanguageSwitcher />
        <a className={styles.navPrimary} href={primaryHref}>{primaryLabel}</a>
      </div>
    </nav>
  );
}
