'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./deals-section.module.css";

const deals = [
  {
    title: "Calathea Medallion",
    label: "Indoor Plant",
    currentPrice: "$20.00",
    originalPrice: "$40.00",
    discountPercent: "30% off",
    rating: "5.0",
    image:
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Birds Nest",
    label: "Indoor Plant",
    currentPrice: "$22.00",
    originalPrice: "$44.00",
    discountPercent: "50% off",
    rating: "5.0",
    image:
      "https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Spider Plant",
    label: "Indoor Plant",
    currentPrice: "$18.00",
    originalPrice: "$36.00",
    discountPercent: "50% off",
    rating: "5.0",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Peace Lily",
    label: "Indoor Plant",
    currentPrice: "$24.00",
    originalPrice: "$48.00",
    discountPercent: "50% off",
    rating: "5.0",
    image:
      "https://images.unsplash.com/photo-1773332611522-06b86b48cbf1?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function DealsSection() {
  return (
    <section className={styles.dealsSection}>
      <div className="container">
        <div className={styles.dealsHeader}>
          <div className={styles.dealsKicker}>Today Deals</div>
          <h2 className={styles.dealsTitle}>
            <span>Deals</span> of the Day
          </h2>
        </div>

        <div className={styles.dealsTrack}>
          <div className={styles.dealsGrid}>
            {deals.map((item, index) => (
              <motion.article
                key={item.title}
                className={styles.dealCard}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <div className={styles.dealBadge}>{item.discountPercent}</div>
                <div className={styles.dealImageWrap}>
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 991px) 85vw, 30vw"
                    className={styles.dealImage}
                  />
                </div>

                <div className={styles.dealBody}>
                  <div className={styles.dealMeta}>
                    <span>{item.label}</span>
                    <span className={styles.dealRating}>
                      <span className={styles.dealStar}>★</span>
                      {item.rating}
                    </span>
                  </div>
                  <h3 className={styles.dealName}>{item.title}</h3>
                  <div className={styles.dealPriceRow}>
                    <div className={styles.dealCurrent}>{item.currentPrice}</div>
                    <div className={styles.dealOriginal}>{item.originalPrice}</div>
                  </div>
                  <p className={styles.dealText}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </p>
                  <a href="#pricing" className={styles.dealLink}>
                    Shop Now
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <div className={styles.promoGrid}>
          <motion.article
            className={styles.promoCardLight}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
          >
            <div className={styles.promoTag}>Flat 20% Discount</div>
            <h3 className={styles.promoTitle}>
              Freshly <span>Green Plants</span>
            </h3>
            <p className={styles.promoText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </p>
            <div className={styles.promoCountdown}>
              <div className={styles.promoCountdownItem}>
                <strong className={styles.promoCountdownValue}>04</strong>
                <span className={styles.promoCountdownLabel}>Days</span>
              </div>
              <div className={styles.promoCountdownItem}>
                <strong className={styles.promoCountdownValue}>14</strong>
                <span className={styles.promoCountdownLabel}>Hours</span>
              </div>
              <div className={styles.promoCountdownItem}>
                <strong className={styles.promoCountdownValue}>48</strong>
                <span className={styles.promoCountdownLabel}>Minutes</span>
              </div>
              <div className={styles.promoCountdownItem}>
                <strong className={styles.promoCountdownValue}>18</strong>
                <span className={styles.promoCountdownLabel}>Seconds</span>
              </div>
            </div>
            <a href="#pricing" className={styles.promoButton}>
              Shop Now
            </a>
            <div className={styles.promoLeafLeft} aria-hidden="true" />
            <div className={styles.promoModelLeft} aria-hidden="true" />
          </motion.article>

          <motion.article
            className={styles.promoCardYellow}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <div className={styles.promoTagDark}>Flat 25% Discount</div>
            <h3 className={styles.promoTitleDark}>
              Graceful <span>Flower Plant</span>
            </h3>
            <p className={styles.promoTextDark}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </p>
            <a href="#pricing" className={styles.promoButtonDark}>
              Shop Now
            </a>
            <div className={styles.promoModelRight} aria-hidden="true" />
          </motion.article>
        </div>
      </div>
    </section>
  );
}
