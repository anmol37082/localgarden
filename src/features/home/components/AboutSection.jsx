'use client';

import { motion } from "framer-motion";
import styles from "./about-section.module.css";

const aboutCards = [
  {
    title: "Mission",
    text: "To provide simple, effective, and organic plant care solutions that help every plant grow better, and every space feel greener.",
  },
  {
    title: "Vision",
    text: "To create greener homes, healthier plants, and a better environment by making gardening simple for everyone.",
  },
];

export default function AboutSection() {
  return (
    <section className={styles.aboutSection} id="about">
      <div className="container">
        <div className={styles.aboutTop}>
          <div className={styles.sectionKicker}>[ABOUT US]</div>
          <p className={styles.aboutLead}>
          Local Garden by Akshay Organics was started in 2017 with one goal, to make plant care easy and bring more greenery into everyday life. From beautiful landscaping, vertical gardens, and rooftop gardens to organic plant care products, we help plants grow healthier, stronger, and happier naturally.
Because every plant deserves the right care to bloom beautifully.
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
              <h3 className={styles.aboutCardTitle}>{item.title}</h3>
              <p className={styles.aboutCardText}>{item.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
