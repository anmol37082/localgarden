'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import styles from "./feature-panel-section.module.css";

const features = [
  {
    title: "Pollution Detection",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
    description: "Spot contamination patterns from the surrounding environment.",
  },
  {
    title: "Species Identification",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80",
    description: "Compare moss traits and identify regional bio-signals.",
  },
  {
    title: "Environmental Trend Mapping",
    image: "https://images.unsplash.com/photo-1598758448707-20609c80cca9?auto=format&fit=crop&w=1200&q=80",
    description: "Track seasonal shifts and ecosystem change over time.",
  },
  {
    title: "Real-Time Ecosystem Alerts",
    image: "https://images.unsplash.com/photo-1592748886453-1d88d13198cc?auto=format&fit=crop&w=1200&q=80",
    description: "Surface active changes as they happen in the field.",
  },
];

export default function FeaturePanelSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFeature = features[activeIndex];

  return (
    <section className={styles.featureSection}>
      <div className="container">
        <div className={styles.featureGrid}>
          <div className={styles.featureCopy}>
            <div className={styles.sectionKickerDark}>[FEATURES]</div>
            <h2 className={styles.featureTitle}>
              Built for Researchers,
              <span> Powered by AI</span>
            </h2>

            <div className={styles.featureList}>
              {features.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  className={`${styles.featureRow} ${
                    activeIndex === index ? styles.featureRowActive : ""
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className={styles.featureIndex}>{String(index + 1).padStart(2, "0")}.</span>
                  <span className={styles.featureName}>{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.featureVisual}>
            <img
              src={activeFeature.image}
              alt=""
              className={styles.featureImage}
            />
            <div className={styles.featureCaption}>
              <span className={styles.featureCaptionTitle}>{activeFeature.title}</span>
              <span className={styles.featureCaptionText}>{activeFeature.description}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
