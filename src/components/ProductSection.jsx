'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./product-section.module.css";

const products = [
  {
    title: "Monstera deliciosa",
    label: "Indoor Plant",
    rating: "4.9",
    currentPrice: "$12.50",
    originalPrice: "$25.00",
    discountPercent: "50% off",
    image:
      "https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Watermelon Peperomia",
    label: "Indoor Plant",
    rating: "4.9",
    currentPrice: "$20.00",
    originalPrice: "$25.00",
    discountPercent: "20% off",
    image:
      "https://images.unsplash.com/photo-1511576661531-b34d7da5d0bb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Pepper Face Plant",
    label: "Indoor Plant",
    rating: "4.9",
    currentPrice: "$12.00",
    originalPrice: "$15.00",
    discountPercent: "20% off",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Bird's Nest Fern",
    label: "Indoor Plant",
    rating: "4.9",
    currentPrice: "$20.00",
    originalPrice: "$25.00",
    discountPercent: "20% off",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function ProductSection() {
  return (
    <section className={styles.productSection}>
      <div className="container">
        <div className={styles.productHeader}>
          <div className={styles.productHeading}>
            <div className={styles.productKicker}>Our Products</div>
            <h2 className={styles.productTitle}>
              Our Top Seller Products
            </h2>
          </div>

          <a href="#pricing" className={styles.productButton}>
            View All Products
          </a>
        </div>

        <div className={styles.productGrid}>
          {products.map((item, index) => (
            <motion.article
              key={item.title}
              className={styles.productCard}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <div className={styles.productBadge}>{item.discountPercent}</div>
              <div className={styles.productImageWrap}>
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 991px) 50vw, 33vw"
                  className={styles.productImage}
                />
              </div>

              <div className={styles.productBody}>
                <div className={styles.productLabel}>{item.label}</div>
                <div className={styles.productMetaRow}>
                  <h3 className={styles.productCardTitle}>{item.title}</h3>
                  <div className={styles.productRating}>
                    <span className={styles.productStar}>★</span>
                    <span>{item.rating}</span>
                  </div>
                </div>
                <div className={styles.productPriceRow}>
                  <div className={styles.productCurrentPrice}>{item.currentPrice}</div>
                  <div className={styles.productOriginalPrice}>{item.originalPrice}</div>
                </div>
                <a href="#pricing" className={styles.productCartButton}>
                  Add to Cart
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        <div className={styles.productPromoGrid}>
          <div className={styles.productOfferCard}>
            <div className={styles.productOfferLeafLeft} aria-hidden="true" />
            <div className={styles.productOfferLeafRight} aria-hidden="true" />
            <div className={styles.productOfferKicker}>Nature&apos;s Special Offer</div>
            <div className={styles.productOfferTitle}>
              <span>Special</span>
              <span>Offer</span>
            </div>
            <p className={styles.productOfferText}>Get 50% off - Limited Time Offer!</p>
            <div className={styles.productCountdown}>
              <div>
                <strong>04</strong>
                <span>Days</span>
              </div>
              <div>
                <strong>14</strong>
                <span>Hours</span>
              </div>
              <div>
                <strong>48</strong>
                <span>Minutes</span>
              </div>
              <div>
                <strong>18</strong>
                <span>Seconds</span>
              </div>
            </div>
            <a href="#pricing" className={styles.productOfferButton}>
              Shop Now
            </a>
          </div>

          <div className={styles.productPromoStack}>
            <div className={styles.productPromoImageCard}>
              <Image
                src="https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&w=1200&q=80"
                alt=""
                fill
                sizes="(max-width: 991px) 100vw, 18vw"
                className={styles.productPromoImage}
              />
            </div>
            <div className={styles.productPromoImageCard}>
              <Image
                src="https://images.unsplash.com/photo-1778767061107-9d2cff5a132b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                fill
                sizes="(max-width: 991px) 100vw, 18vw"
                className={styles.productPromoImage}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
