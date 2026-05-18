'use client';

import Link from "next/link";
import styles from "./header.module.css";

const navItems = [
  { href: "#", label: "Home" },
  { href: "#benefits", label: "Services" },
  { href: "#pricing", label: "Case Studies" },
  { href: "#about", label: "About" },
  { href: "#insight", label: "Insight" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className={styles.header}>
      <div className="container-fluid">
        <div className={styles.headerInner}>
          <Link href="#" className={styles.brand} aria-label="PlantBoost home">
            <span className={styles.brandMark}>P</span>
          </Link>

          <nav className={styles.nav} aria-label="Primary">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className={styles.navLink}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <span className={styles.lang}>ENG</span>
            <Link href="#contact" className={styles.cta}>
              Start Analyze
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
