'use client';

//* eslint-disable @next/next/no-img-element */

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import styles from "./hero.module.css";

export default function Hero() {
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 900], [0, -180]);
  const smoothImageY = useSpring(imageY, {
    stiffness: 80,
    damping: 22,
    mass: 0.35,
  });

  return (
    <section className={styles.heroSection} id="home">
      <div className="container">
        <motion.div
          className={styles.banner}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
        >
          <picture className={styles.bannerMedia}>
            <source media="(max-width: 575.98px)" srcSet="/hero7mobile.png" />
            <motion.img
              src="/hero7.png"
              alt="Plant Growth Enhancer hero banner"
              className={styles.bannerMediaImage}
              style={{ y: smoothImageY }}
            />
          </picture>

          <div className={styles.bannerContent}>
            <motion.div
              className={styles.heroIntro}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className={styles.headline}>
                Understand
                <span className={styles.headlineRow}>
                  Plant Growth Naturally
                </span>
                <span className={styles.headlineAccent}>For Healthier Green Care</span>
              </h1>
            </motion.div>

            <motion.div
              className={styles.wordmark}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
            >
              Local Garden
            </motion.div>

            <motion.p
              className={styles.sideNote}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              A clean, premium plant enhancer for routine care. Designed to look modern,
              trustworthy, and simple to use.
            </motion.p>
          </div>

          <div className={styles.bannerStats}>
            <motion.div
              className={styles.statCard}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
            >
              <span className={styles.statLabel}>Diverse samples from global climates</span>
              <span className={styles.statValue}>120k+</span>
              <span className={styles.statNote}>Moss Samples Analyzed</span>
            </motion.div>

            <motion.div
              className={styles.statCard}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
            >
              <span className={styles.statLabel}>High-confidence recognition</span>
              <span className={styles.statValue}>98.7%</span>
              <span className={styles.statNote}>Identification Accuracy</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
