'use client';

import Image from "next/image";
import styles from "./product-love-section.module.css";

export default function ProductLoveSection({ product }) {
  const points = product.lovePoints ?? product.highlights ?? [];
  const [largeImage, smallImage] = product.loveImages ?? product.images ?? [];

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.copy}>
            <h2 className={styles.title}>Why you&apos;ll love it</h2>
            <div className={styles.points}>
              {points.map((point) => (
                <div key={point} className={styles.point}>
                  <span className={styles.pointIcon}>⊞</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
            <div className={styles.smallImageWrap}>
              {smallImage ? (
                <Image
                  src={smallImage.src}
                  alt={smallImage.alt}
                  fill
                  sizes="(max-width: 991px) 100vw, 28vw"
                  className={styles.image}
                />
              ) : null}
            </div>
          </div>

          <div className={styles.visual}>
            <div className={styles.largeImageWrap}>
              {largeImage ? (
                <Image
                  src={largeImage.src}
                  alt={largeImage.alt}
                  fill
                  sizes="(max-width: 991px) 100vw, 34vw"
                  className={styles.image}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
