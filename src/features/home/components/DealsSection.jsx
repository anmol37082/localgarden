'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./deals-section.module.css";

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

const renderComboTitle = (comboItems) =>
  comboItems.map((comboItem, index) => (
    <span key={comboItem}>
      {index > 0 ? "+ " : ""}
      {comboItem}
    </span>
  ));

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
  const trackRef = useRef(null);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isThanksVisible, setIsThanksVisible] = useState(false);

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

  useEffect(() => {
    if (!selectedDeal) {
      setIsThanksVisible(false);
    }
  }, [selectedDeal]);

  const closeModal = () => {
    setIsThanksVisible(false);
    setSelectedDeal(null);
  };

  const handleBuyNow = () => {
    setIsThanksVisible(true);
  };

  const scrollDeals = (direction) => {
    if (!trackRef.current) return;

    const amount = Math.max(320, Math.floor(trackRef.current.clientWidth * 0.8));
    trackRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className={styles.dealsSection}>
      <div className="container">
        <div className={styles.dealsHeader}>
          <div className={styles.dealsKicker}>Today Deals</div>
          <h2 className={styles.dealsTitle}>
            <span>Combos</span>
          </h2>
        </div>

        <div className={styles.dealsTrackWrap}>
          <button
            type="button"
            className={`${styles.dealsSwipeButton} ${styles.dealsSwipeLeft}`}
            onClick={() => scrollDeals("left")}
            aria-label="Scroll deals left"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.dealsSwipeIcon}>
              <path
                d="M15 18 9 12l6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className={styles.dealsTrack} ref={trackRef}>
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
                    <h3 className={styles.dealName}>{renderComboTitle(item.comboItems)}</h3>
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

          <button
            type="button"
            className={`${styles.dealsSwipeButton} ${styles.dealsSwipeRight}`}
            onClick={() => scrollDeals("right")}
            aria-label="Scroll deals right"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.dealsSwipeIcon}>
              <path
                d="m9 6 6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

      </div>

      {selectedDeal ? (
        <div className={styles.modalBackdrop} role="presentation" onClick={closeModal}>
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
              onClick={closeModal}
            >
              x
            </button>

            {isThanksVisible ? (
              <div className={styles.thanksPopup}>
                <div className={styles.thanksBadge}>Thanks</div>
                <h3 className={styles.thanksTitle}>Thanks for your order.</h3>
                <p className={styles.thanksText}>
                  Your combo request has been received. We will contact you shortly on the details you entered.
                </p>
                <div className={styles.thanksActions}>
                  <button type="button" className={styles.thanksSecondaryButton} onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
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

                  <button type="button" className={styles.buyNowButton} onClick={handleBuyNow}>
                    Buy Now
                  </button>
                </div>

                <div className={styles.modalInfo}>
                  <div className={styles.modalInfoRow}>
                    <span>Name</span>
                    <input type="text" placeholder="Enter name" className={styles.modalInput} />
                  </div>
                  <div className={styles.modalInfoRow}>
                    <span>Mob</span>
                    <input type="tel" placeholder="Enter mobile number" className={styles.modalInput} />
                  </div>
                  <div className={styles.modalInfoRow}>
                    <span>Mobile Alternative</span>
                    <input type="tel" placeholder="Enter alternative mobile number" className={styles.modalInput} />
                  </div>
                  <div className={styles.modalInfoRow}>
                    <span>Shipping Address</span>
                    <input type="text" placeholder="Enter shipping address" className={styles.modalInput} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
