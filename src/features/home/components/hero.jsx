'use client';

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
          <motion.video
            className={styles.bannerMediaVideo}
            style={{ y: smoothImageY }}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source
              src="/herovideomobile.mp4"
              type="video/mp4"
              media="(max-width: 575.98px)"
            />
            <source src="/herovideo3.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </motion.video>

          <div className={styles.bannerContent}>
            <motion.div
              className={styles.heroIntro}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className={styles.headline}>
                Helping 
                <span className={styles.headlineRow}>
                   Every Plant 
                </span>
                <span className={styles.headlineAccent}>Grow Happier</span>
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
             Advanced plant care formulas that nourish roots, improve soil, and support beautiful natural growth for every plant type. 
            </motion.p>
          </div>

          <div className={styles.bannerStats}>
            <motion.div
              className={styles.statCard}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
            >
              <span className={styles.statLabel}>Pure Organic Care</span>
              <span className={styles.statValue}>100%</span>
              <span className={styles.statNote}>Natural & Plant-Friendly Formula </span>
            </motion.div>

            <motion.div
              className={styles.statCard}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
            >
              <span className={styles.statLabel}>Trusted By Plant Lovers</span>
              <span className={styles.statValue}>50K+</span>
              <span className={styles.statNote}>Happy Gardening Customers </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
