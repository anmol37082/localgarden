'use client';

import { motion } from "framer-motion";
import styles from "./trusty-strip.module.css";

const trustItems = [
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

export default function TrustyStrip() {
  return (
    <section className={styles.trustySection}>
      <div className="container">
        <div className={styles.trustyGrid}>
          {trustItems.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                className={styles.trustyCard}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <span className={styles.trustyIcon}>
                  <Icon />
                </span>
                <span className={styles.trustyTitle}>{feature.title}</span>
                <span className={styles.trustyText}>{feature.text}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
