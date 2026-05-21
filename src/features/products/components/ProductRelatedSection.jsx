'use client';

import Image from "next/image";
import Link from "next/link";
import styles from "./product-related-section.module.css";

export default function ProductRelatedSection({ product }) {
  const relatedProducts = product.relatedProducts ?? [];

  if (!relatedProducts.length) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Related Products</h2>
          <span className={styles.subtitle}>More products from the collection</span>
        </div>

        <div className={styles.grid}>
          {relatedProducts.map((item) => (
            <Link key={item.href} href={item.href} className={styles.card}>
              <div className={styles.imageWrap}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={styles.image}
                />
              </div>

              <div className={styles.body}>
                <div className={styles.label}>Indoor Plant</div>
                <div className={styles.metaRow}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                </div>
                <div className={styles.priceRow}>
                  <div className={styles.price}>{item.price}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
