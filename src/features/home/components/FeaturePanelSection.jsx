'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import styles from "./feature-panel-section.module.css";

const features = [
  {
    title: "Nature-Powered Nutrition",
    image: "/benifites/point1.webp",
    description: "Organic nourishment that supports healthy plant growth naturally.",
  },
  {
    title: "Faster & Healthier Growth",
    image: "/benifites/point2.webp",
    description: "Helps plants grow stronger, greener, and more active over time.",
  },
  {
    title: "More Flowers, More Fruits",
    image: "/benifites/point3.webp",
    description: "Supports better blooming and fruiting for productive plants.",
  },
  {
    title: "Soil Care & Plant Protection",
    image: "/benifites/point4.webp",
    description: "Improves soil health while helping protect plant strength.",
  },
  {
    title: "Simple Gardening Made Easy",
    image: "/benifites/point5.webp",
    description: "Easy-to-use care for everyday gardening without hassle.",
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
            <div className={styles.sectionKickerDark}>[BENIFITES]</div>
            <h2 className={styles.featureTitle}>
             Give Your Plants The
              <span> Love They Grow</span>
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
