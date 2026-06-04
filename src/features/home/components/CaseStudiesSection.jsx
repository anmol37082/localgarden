'use client';
/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
import styles from "./case-studies-section.module.css";

const caseStudies = [
  {
    year: "2025",
    title: "For Stronger Roots",
    description: "Nutrition That Starts From The Soil",
    image: "/casestudies/Artboard%201.webp",
  },
  {
    year: "2025",
    title: "2X Plant Growth",
    description: "Fueling Faster, Healthier & Greener Growth",
    image: "/casestudies/Artboard%202.webp",
  },
  {
    year: "2025",
    title: "Disease Protection",
    description: "Healthy Plants Begin With Strong Immunity",
    image: "/casestudies/Artboard%203.webp",
  },
  {
    year: "2025",
    title: "Made For Every Plant",
    description: "From Indoor Pots To Rooftop Gardens",
    image: "/casestudies/Artboard%204.webp",
  },
];

export default function CaseStudiesSection() {
  return (
    <section className={styles.caseSection}>
      <div className="container">
        <div className={styles.sectionKicker}>[CASE STUDIES]</div>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionTitleLead}>
            <span className={styles.sectionTitleLeadWord}>Nature </span>
            <span className={styles.sectionTitleLeadTail}>  Friendly Solutions For Healthier Plants & </span>
          </span>
          <span> Happier Planet</span>
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
