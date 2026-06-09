'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { addCartItem, dispatchCartUpdated } from "../../cart/cart-storage";
import styles from "./product-section.module.css";

const products = [
  {
    slug: "plant-growth-enhancer",
    href: "/products/plant-growth-enhancer",
    title: "Plant Growth Enhancer",
    label: "Indoor Plant / Outdoor Plant",
    rating: "4.9",
    currentPrice: "₹416.00",
    originalPrice: "₹520.00",
    discountPercent: "20% off",
    image: "/growth%20enhancer/Artboard%201.png",
  },
  {
    slug: "flower-fruit-booster",
    href: "/products/flower-fruit-booster",
    title: "Flower & Fruit Booster",
    label: "Indoor Plant / Outdoor Plant",
    rating: "4.9",
    currentPrice: "₹416.00",
    originalPrice: "₹520.00",
    discountPercent: "20% off",
    image: "/fruit%20and%20flower%20booster/Artboard%201.png",
  },
  {
    slug: "bio-npk-granules",
    href: "/products/bio-npk-granules",
    title: "Bio NPK Granules",
    label: "Indoor Plant / Outdoor Plant",
    rating: "4.9",
    currentPrice: "₹360.00",
    originalPrice: "₹450.00",
    discountPercent: "20% off",
    image: "/BIo%20npk/Artboard%201.png",
  },
];

const initialCountdown = {
  days: 4,
  hours: 14,
  minutes: 48,
  seconds: 18,
};

const padCountdownValue = (value) => String(Math.max(0, value)).padStart(2, "0");

export default function ProductSection() {
  const [countdown, setCountdown] = useState(initialCountdown);

  const handleAddToCart = (item) => {
    addCartItem(
      {
        slug: item.slug,
        title: item.title,
        price: item.currentPrice,
        compareAt: item.originalPrice,
        images: [{ src: item.image, alt: item.title }],
      },
      {
        quantity: 1,
      },
    );

    dispatchCartUpdated({ openCart: true });
  };

  useEffect(() => {
    const totalSeconds =
      initialCountdown.days * 24 * 60 * 60 +
      initialCountdown.hours * 60 * 60 +
      initialCountdown.minutes * 60 +
      initialCountdown.seconds;

    const endTime = Date.now() + totalSeconds * 1000;

    const updateCountdown = () => {
      const remainingSeconds = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

      const days = Math.floor(remainingSeconds / (24 * 60 * 60));
      const hours = Math.floor((remainingSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((remainingSeconds % (60 * 60)) / 60);
      const seconds = remainingSeconds % 60;

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className={styles.productSection} id="products">
      <div className="container">
        <div className={styles.productHeader}>
          <div className={styles.productHeading}>
            <div className={styles.productKicker}>Our Products</div>
            <h2 className={styles.productTitle}>Most Loved By Plant Parents</h2>
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
              <Link href={item.href} className={styles.productImageLink} aria-label={`Open ${item.title}`}>
                <div className={styles.productImageWrap}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 991px) 50vw, 33vw"
                    className={styles.productImage}
                  />
                </div>
              </Link>

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
                  <div className={styles.productPriceGroup}>
                    <div className={styles.productCurrentPrice}>{item.currentPrice}</div>
                    <div className={styles.productOriginalPrice}>{item.originalPrice}</div>
                  </div>
                  <div className={styles.productBadge}>{item.discountPercent}</div>
                </div>
                <button
                  type="button"
                  className={styles.productCartButton}
                  onClick={() => handleAddToCart(item)}
                  aria-label={`Add ${item.title} to cart`}
                >
                  Add to Cart
                </button>
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
            <p className={styles.productOfferText}>Get 30% off - Limited Time Offer!</p>
            <div className={styles.productCountdown}>
              <div>
                <strong>{padCountdownValue(countdown.days)}</strong>
                <span>Days</span>
              </div>
              <div>
                <strong>{padCountdownValue(countdown.hours)}</strong>
                <span>Hours</span>
              </div>
              <div>
                <strong>{padCountdownValue(countdown.minutes)}</strong>
                <span>Minutes</span>
              </div>
              <div>
                <strong>{padCountdownValue(countdown.seconds)}</strong>
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
                src="https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                fill
                sizes="(max-width: 991px) 100vw, 18vw"
                className={styles.productPromoImage}
              />
            </div>
            <div className={styles.productPromoImageCard}>
              <Image
                src="https://images.unsplash.com/photo-1747339385292-d58fdff13938?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
