'use client';

import Image from "next/image";
import styles from "./footer-section.module.css";

const footerColumns = [
  {
    label: "Platform",
    links: ["Dashboard", "Species Recognition", "Pollution Detection", "Ecosystem Maps", "API Access"],
  },
  {
    label: "Resources",
    links: ["Documentation", "Research Library", "Case Studies", "Tutorials", "Support Center"],
  },
  {
    label: "Company",
    links: ["About Us", "Careers", "Partners", "Press", "Contact"],
  },
  {
    label: "Legal",
    links: ["Privacy Policy", "Terms & Conditions", "Data Security", "Cookie Settings"],
  },
  {
    label: "Social",
    links: ["Twitter", "LinkedIn", "GitHub", "Research Blog"],
  },
  {
    label: "Find Us",
    links: ["+1 (415) 987-2041", "hello@greenarbor.ai", "128 Green Arbor Way", "Portland, OR 97203 US"],
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
          src="https://images.unsplash.com/photo-1692039743847-be242d0e1fa4?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          sizes="100vw"
        />
      </div>
    </footer>
  );
}
