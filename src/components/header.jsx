'use client';

import { useEffect, useState } from "react";
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);

  useEffect(() => {
    if (!drawerOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeDrawer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawerOpen]);

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

          <button
            type="button"
            className={styles.menuButton}
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            onClick={() => setDrawerOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        className={`${styles.drawerBackdrop} ${drawerOpen ? styles.drawerBackdropOpen : ""}`}
        onClick={closeDrawer}
      />

      <aside
        id="mobile-drawer"
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}
        aria-hidden={!drawerOpen}
      >
        <nav className={styles.drawerNav} aria-label="Mobile primary">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className={styles.drawerLink} onClick={closeDrawer}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.drawerActions}>
          <span className={styles.drawerLang}>ENG</span>
          <Link href="#contact" className={styles.drawerCta} onClick={closeDrawer}>
            Start Analyze
          </Link>
        </div>
      </aside>
    </header>
  );
}
