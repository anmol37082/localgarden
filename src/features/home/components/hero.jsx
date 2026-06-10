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
        <source src="/herovidbanmob1.webm" type="video/webm" media="(max-width: 575.98px)" />
        <source src="/herovidbanmob1.mp4" type="video/mp4" media="(max-width: 575.98px)" />
        <source src="/herobannervid1.webm" type="video/webm" />
        <source src="/herobannervid1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
}
