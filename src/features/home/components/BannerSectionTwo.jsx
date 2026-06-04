'use client';

import Image from "next/image";
import styles from "./banner-section-two.module.css";

export default function BannerSectionTwo() {
  return (
    <section className={styles.bannerSectionTwo}>
      <Image
        src="/banner/banner2.webp"
        alt="Local Garden banner"
        fill
        priority
        sizes="100vw"
        className={styles.bannerImage}
      />
      <div className={styles.bannerOverlay} aria-hidden="true" />
    </section>
  );
}
