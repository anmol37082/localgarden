'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./deals-section.module.css";

const featureItems = [
  {
    title: "Free shipping",
    text: "Free Shipping in the City",
    icon: ShippingIcon,
  },
  {
    title: "Price-match guarantee",
    text: "Safe money when ordering with us",
    icon: TagIcon,
  },
  {
    title: "Budget-friendly",
    text: "Receive in lowest price guaranty",
    icon: WalletIcon,
  },
  {
    title: "Customer satisfaction",
    text: "Customer satisfaction our priority.",
    icon: StarIcon,
  },
];

function ShippingIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3.5 7.5h9v8h-9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 10h3.8l2.7 2.7V15.5h-6.5V10z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="7.3" cy="16.8" r="1.45" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.3" cy="16.8" r="1.45" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4.5 12.3 12.2 4.6h6.7v6.7L11.2 19c-.7.7-1.8.7-2.5 0L4.5 14.8c-.7-.7-.7-1.8 0-2.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="16.2" cy="7.9" r="1.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4.5 8.5h13.8c.8 0 1.5.7 1.5 1.5v7.5c0 .8-.7 1.5-1.5 1.5H7c-1.4 0-2.5-1.1-2.5-2.5v-8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 11.5H16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="15.8" cy="12.5" r="0.9" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m12 3.7 2.5 5.1 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const comboProducts = {
  "Plant Growth Enhancer": { originalPrice: 520, image: "/growth%20enhancer/Artboard%201.png" },
  "Flower & Fruit Booster": {
    originalPrice: 520,
    image: "/fruit%20and%20flower%20booster/Artboard%201.png",
  },
  "Bio NPK Granules": { originalPrice: 450, image: "/BIo%20npk/Artboard%201.png" },
};

const formatPrice = (value) => `Rs. ${value.toFixed(2)}`;

const buildComboDeal = (comboItems, image) => {
  const originalTotal = comboItems.reduce((sum, item) => sum + comboProducts[item].originalPrice, 0);
  const currentTotal = originalTotal * 0.8;

  return {
    title: comboItems.join(" + "),
    label: `${comboItems.length} Product Combo`,
    currentPrice: formatPrice(currentTotal),
    originalPrice: formatPrice(originalTotal),
    discountPercent: "20% off",
    rating: "5.0",
    comboItems,
    image,
  };
};

const comboDeals = [
  buildComboDeal(
    ["Plant Growth Enhancer", "Flower & Fruit Booster"],
    "/combos/fruitflowerboostergrowthenhancer.webp",
  ),
  buildComboDeal(
    ["Plant Growth Enhancer", "Bio NPK Granules"],
    "/combos/bionpkgrowthenhancer.webp",
  ),
  buildComboDeal(
    ["Flower & Fruit Booster", "Bio NPK Granules"],
    "/combos/bionpkfruitflowerbooster.webp",
  ),
  buildComboDeal(
    ["Plant Growth Enhancer", "Flower & Fruit Booster", "Bio NPK Granules"],
    "/combos/bionpkplantboostergrowthenhancer.webp",
  ),
];

export default function DealsSection() {
  const [selectedDeal, setSelectedDeal] = useState(null);

  useEffect(() => {
    if (!selectedDeal) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedDeal(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedDeal]);

  return (
    <section className={styles.dealsSection}>
      <div className="container">
        <div className={styles.dealsHeader}>
          <div className={styles.dealsKicker}>Today Deals</div>
          <h2 className={styles.dealsTitle}>
            <span>Combos</span>
          </h2>
        </div>

        <div className={styles.dealsTrack}>
          <div className={styles.dealsGrid}>
            {comboDeals.map((item, index) => (
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
                    alt={item.title}
                    fill
                    sizes="(max-width: 991px) 85vw, 30vw"
                    className={styles.dealImage}
                  />
                </div>

                <div className={styles.dealBody}>
                  <div className={styles.dealMeta}>
                    <span>{item.label}</span>
                    <span className={styles.dealRating}>
                      <span className={styles.dealStar}>*</span>
                      {item.rating}
                    </span>
                  </div>
                  <h3 className={styles.dealName}>{item.title}</h3>
                  <div className={styles.dealComboItems}>
                    {item.comboItems.map((comboItem) => (
                      <span key={comboItem} className={styles.dealComboItem}>
                        {comboItem}
                      </span>
                    ))}
                  </div>
                  <div className={styles.dealPriceRow}>
                    <div className={styles.dealCurrent}>{item.currentPrice}</div>
                    <div className={styles.dealOriginal}>{item.originalPrice}</div>
                  </div>
                  <button
                    type="button"
                    className={styles.dealLink}
                    onClick={() => setSelectedDeal(item)}
                  >
                    Shop Now
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <div className={styles.comboFeatureStrip}>
          {featureItems.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                className={styles.comboFeatureCard}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <span className={styles.comboFeatureIcon}>
                  <Icon />
                </span>
                <span className={styles.comboFeatureTitle}>{feature.title}</span>
                <span className={styles.comboFeatureText}>{feature.text}</span>
              </motion.div>
            );
          })}
        </div>

      </div>

      {selectedDeal ? (
        <div className={styles.modalBackdrop} role="presentation" onClick={() => setSelectedDeal(null)}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label="Deal details"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalClose}
              aria-label="Close deal popup"
              onClick={() => setSelectedDeal(null)}
            >
              x
            </button>

            <div className={styles.modalDetails}>
              <div className={styles.modalVisual}>
                <div className={styles.modalImageWrap}>
                  <Image
                    src={selectedDeal.image}
                    alt={selectedDeal.title}
                    fill
                    sizes="(max-width: 767px) 100vw, 24rem"
                    className={styles.modalImage}
                  />
                </div>

                <Link href="/checkout" className={styles.buyNowButton}>
                  Buy Now
                </Link>
              </div>

              <div className={styles.modalInfo}>
                <div className={styles.modalInfoRow}>
                  <span>Name</span>
                  <strong>{selectedDeal.title}</strong>
                </div>
                <div className={styles.modalInfoRow}>
                  <span>Mobile</span>
                  <input type="tel" placeholder="Enter mobile number" className={styles.modalInput} />
                </div>
                <div className={styles.modalInfoRow}>
                  <span>Email</span>
                  <input type="email" placeholder="Enter email address" className={styles.modalInput} />
                </div>
                <div className={styles.modalInfoRow}>
                  <span>Combo includes</span>
                  <strong>{selectedDeal.comboItems?.join(" + ") ?? `${selectedDeal.label} - ${selectedDeal.currentPrice}`}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
