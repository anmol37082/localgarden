'use client';

import Image from "next/image";
import styles from "./product-banner-section.module.css";

export default function ProductBannerSection({ product }) {
  return (
    <section className={styles.section}>
      <div className={styles.banner}>
        <Image
          src={product.bannerImage ?? product.images?.[0]?.src}
          alt={product.bannerTitle ?? product.title}
          fill
          priority={false}
          sizes="100vw"
          className={styles.bannerImage}
        />

        <div className={styles.card}>
          <h2 className={styles.title}>{product.bannerTitle ?? product.title}</h2>
          <p className={styles.text}>{product.bannerText ?? product.summary}</p>
        </div>
      </div>
    </section>
  );
}
