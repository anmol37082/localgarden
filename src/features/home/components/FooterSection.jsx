'use client';

import Image from "next/image";
import styles from "./footer-section.module.css";

const footerColumns = [
  {
    label: "Products",
    links: ["Plant Growth Enhancer", "Flower & Fruit Booster", "BIO NPK Granules", "All Products"],
  },
  {
    label: "About",
    links: ["About Us", "Mission", "Vision", "Plant Care Benefits"],
  },
  {
    label: "Help",
    links: ["How to Use", "Shipping & Returns", "FAQ", "Support Center"],
  },
  {
    label: "Contact",
    links: [
      "+91 98765 43210",
      "hello@localgarden.in",
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
                {column.links.map((link) => (
                  <li key={link} className={styles.footerItem}>
                    <span className={styles.footerLink}>{link}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footerArtwork} aria-hidden="true">
        <Image
          fill
          className={styles.footerArtworkImage}
          src="/footer.webp"
          alt=""
          sizes="100vw"
        />
      </div>
    </footer>
  );
}
