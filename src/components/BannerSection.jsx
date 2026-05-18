'use client';

import styles from "./banner-section.module.css";

export default function BannerSection() {
  return (
    <section className={styles.bannerSection}>
      <video
        className={styles.bannerVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        >
        <source
          src="https://stream.media.imgix.video/5A2sgD7VEZ02yaP2drZepFPhxwneHLdkh/high.mp4?"
          type="video/mp4"
        />
      </video>
      <div className={styles.bannerOverlay} aria-hidden="true" />
    </section>
  );
}
