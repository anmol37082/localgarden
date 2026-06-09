'use client';

import styles from "./hero.module.css";

export default function Hero() {
  return (
    <section className={styles.heroSection} id="home">
      <video
        className={styles.heroVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/herobannervid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
}
