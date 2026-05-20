'use client';

import Image from "next/image";
import styles from "./banner-section.module.css";

export default function BannerSection() {
  return (
    <section className={styles.bannerSection}>
      <Image
        src="/localgardenbanner1.png"
        alt="Banner"
        fill
        priority
        sizes="100vw"
        className={styles.bannerImage}
      />
      <div className={styles.bannerOverlay} aria-hidden="true" />
    </section>
  );
}
