'use client';
/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
import styles from "./case-studies-section.module.css";

const caseStudies = [
  {
    year: "2025",
    title: "Air Pollution Studies",
    description: "Detect heavy metals and urban toxins",
    image:
      "https://images.unsplash.com/photo-1564874997645-eba9f36e5bf2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    year: "2025",
    title: "Forest Health Monitoring",
    description: "Measure climate stress indicators",
    image:
      "https://images.unsplash.com/photo-1592748886453-1d88d13198cc?auto=format&fit=crop&fm=jpg&q=80&w=1600",
  },
  {
    year: "2025",
    title: "Soil Signal Mapping",
    description: "Track soil health variations across regions",
    image:
      "https://images.unsplash.com/photo-1646688830264-f31526a471c4?auto=format&fit=crop&fm=jpg&q=80&w=1600",
  },
  {
    year: "2025",
    title: "Climate Resilience Review",
    description: "Measure resilience across changing conditions",
    image:
      "https://images.unsplash.com/photo-1697698793522-e702c845416c?auto=format&fit=crop&fm=jpg&q=80&w=1600",
  },
];

export default function CaseStudiesSection() {
  return (
    <section className={styles.caseSection}>
      <div className="container">
        <div className={styles.sectionKicker}>[CASE STUDIES]</div>
        <h2 className={styles.sectionTitle}>
          Where Moss Analysis
          <span> Makes an Impact</span>
        </h2>

        <div className={styles.caseGrid}>
          {caseStudies.map((item, index) => (
            <motion.article
              key={item.title}
              className={styles.caseCard}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <div className={styles.caseImageWrap}>
                <img className={styles.caseImage} src={item.image} alt="" />
              </div>
              <div className={styles.caseMeta}>
                <span className={styles.caseYear}>{item.year}</span>
                <div>
                  <h3 className={styles.caseName}>{item.title}</h3>
                  <p className={styles.caseDesc}>{item.description}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className={styles.caseActions}>
          <a href="#pricing" className={styles.caseButton}>
            View All
          </a>
        </div>
      </div>
    </section>
  );
}
