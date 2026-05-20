'use client';
/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
import styles from "./about-section.module.css";

const aboutCards = [
  {
    title: "AI powered environmental intelligence",
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Transforming moss into a climate intelligence signal",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&q=80",
  },
];

export default function AboutSection() {
  return (
    <section className={styles.aboutSection} id="about">
      <div className="container">
        <div className={styles.aboutTop}>
          <div className={styles.sectionKicker}>[ABOUT US]</div>
          <p className={styles.aboutLead}>
            Moss acts as a natural bioindicator, absorbing pollutants, reacting to climate
            shifts, and revealing unseen changes in air and soil health. Our AI engine
            automates moss analysis to help researchers measure environmental conditions
            faster, deeper, and more accurately than traditional methods.
          </p>
        </div>

        <div className={styles.aboutDivider} />

        <div className={styles.aboutGrid}>
          {aboutCards.map((item) => (
            <motion.article
              key={item.title}
              className={styles.aboutCard}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45 }}
            >
              <div className={styles.aboutThumbWrap}>
                <img src={item.image} alt="" className={styles.aboutThumb} />
              </div>
              <h3 className={styles.aboutCardTitle}>{item.title}</h3>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
