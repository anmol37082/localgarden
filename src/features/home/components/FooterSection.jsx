'use client';

import Image from "next/image";
import Link from "next/link";
import styles from "./footer-section.module.css";

const footerColumns = [
  {
    label: "Products",
    links: [
      { label: "Plant Growth Enhancer", href: "/products/plant-growth-enhancer" },
      { label: "Flower & Fruit Booster", href: "/products/flower-fruit-booster" },
      { label: "BIO NPK Granules", href: "/products/bio-npk-granules" },
    ],
  },
  {
    label: "About",
    links: ["About Us", "Contact Us", ],
  },

  {
    label: "Contact",
    links: [
      "+91 9646962098",
      "localgarden2017@gmail.com",
      "Visit Us: DSS. 237, Sector 25, Panchkula Extension, Jhiwri Wala, Panchkula, Haryana 134116",
    ],
  },
];

export default function FooterSection() {
  return (
    <footer className={styles.footerSection}>
      <div className="container">
        <div className={styles.footerGrid}>
          {footerColumns.map((column) => (
            <div key={column.label} className={styles.footerColumn}>
              <div className={styles.footerLabel}>{column.label}</div>
              <ul className={styles.footerList}>
                {column.links.map((link) => {
                  const label = typeof link === "string" ? link : link.label;

                  return (
                  <li key={label} className={styles.footerItem}>
                    {typeof link === "string" ? (
                      <span className={styles.footerLink}>{label}</span>
                    ) : (
                      <Link href={link.href} className={styles.footerLink}>{label}</Link>
                    )}
                  </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footerArtwork} aria-hidden="true">
        <Image
          fill
          className={styles.footerArtworkImage}
          src="/footerreal1.webp"
          alt=""
          sizes="100vw"
        />
      </div>
    </footer>
  );
}
