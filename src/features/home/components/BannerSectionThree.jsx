'use client';

import Image from "next/image";
import styles from "./banner-section-three.module.css";

export default function BannerSectionThree() {
  return (
    <section className={styles.bannerSectionThree}>
      <Image
        src="/banner/banner03.webp"
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
