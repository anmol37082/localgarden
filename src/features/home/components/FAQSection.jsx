'use client';

import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import styles from "./faq-section.module.css";

const faqs = [
  {
    question: "How often should I use Local Garden fertilizer?",
    answer:
      "For best results, apply Local Garden fertilizer every 15–20 days during the active growing and flowering season. Always follow the instructions mentioned on the product packaging.",
  },
  {
    question: "Can I use it for flowering plants and vegetables?",
    answer:
      "Yes, Local Garden fertilizer is suitable for a wide range of flowering plants, ornamental plants, and vegetables. It helps support healthy growth and better flowering.",
  },
  {
    question: "How long does it take to see results?",
    answer:
      "Most plants begin showing visible improvement within 7–14 days of regular application. Results may vary depending on the plant type, soil condition, and growing environment.",
  },
  {
    question: "Is it safe for indoor plants?",
    answer:
      "Yes, our fertilizer is safe for indoor and outdoor plants when used as directed. It provides essential nutrients without harming your plants.",
  },
  {
    question: "Will it help increase flowering and blooming?",
    answer:
      "Absolutely. Local Garden fertilizer is specially formulated to support healthy bud formation, vibrant blooms, and longer flowering periods.",
  },
  {
    question: "Can beginners use this product?",
    answer:
      "Yes. The product is easy to use and suitable for both beginner and experienced gardeners. Clear usage instructions are provided on the packaging.",
  },
  {
    question: "What is the recommended dosage?",
    answer:
      "The recommended dosage depends on the product variant and plant type. Please refer to the product label for detailed application instructions and dosage recommendations.",
  },
  {
    question: "Does it work in all seasons?",
    answer:
      "Yes, Local Garden fertilizer can be used throughout the year. However, plants typically respond best during their active growth and flowering seasons.",
  },
  {
    question: "Are there any shipping charges?",
    answer:
      "Shipping charges may vary based on your location and order value. Any applicable shipping fee will be displayed during checkout before payment.",
  },
  {
    question: "What if I receive a damaged product?",
    answer:
      "Customer satisfaction is our priority. If you receive a damaged product, please contact our support team within 48 hours of delivery with photos, and we will assist you with a replacement or resolution.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className={styles.faqSection} id="faq">
      <div className="container">
        <div className={styles.faqHeader}>
          <div className={styles.faqKicker}>[FAQ SECTION]</div>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
        </div>

        <div className={styles.faqList}>
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <article key={item.question} className={styles.faqItem}>
                <button
                  type="button"
                  className={styles.faqButton}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.faqQuestion}>{item.question}</span>
                  <span className={styles.faqIcon} aria-hidden="true">
                    {isOpen ? <FiMinus /> : <FiPlus />}
                  </span>
                </button>

                {isOpen ? <p className={styles.faqAnswer}>{item.answer}</p> : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
