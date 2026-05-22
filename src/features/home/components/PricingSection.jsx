'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./pricing-section.module.css";

const planData = {
  Starter: {
    title: "Starter",
    badge: "For Individuals",
    description:
      "Perfect for beginners and everyday plant lovers who want easy and effective gardening solutions. Simple-to-use products that help plants grow healthier with minimal effort.",
    price: "$9",
    period: "/month",
    artwork:
      "https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Beginner-friendly formulas",
      "Easy application process",
      "Fast visible results",
      "Promotes healthy blooming",
      "Prevents yellow leaves",
      "Supports indoor & outdoor plants",
      "Organic-based nutrition",
      "Everyday plant care made simple",
    ],
    sectionLabel: "Highlights",
    cta: "Start Free Trial",
  },
  Researcher: {
    title: "Researcher",
    badge: "Most Popular",
    description:
      "Backed by plant research and organic innovation, Local Garden creates advanced plant care solutions for healthier growth and greener spaces. Designed to improve plant health, soil quality, and overall garden performance naturally.",
    price: "",
    period: "",
    artwork:
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Organic & plant-safe formulas",
      "Supports faster plant growth",
      "Improves soil fertility naturally",
      "Boosts flowering & fruiting",
      "Enhances nutrient absorption",
      "Strengthens plant immunity",
      "Eco & climate-friendly solutions",
      "Suitable for all plant types",
    ],
    cta: "",
  },
  "Laboratory Pro": {
    title: "Laboratory Pro",
    badge: "For Labs",
    description:
      "Scientifically crafted plant nutrition solutions designed for professional-level plant care and growth support. Advanced organic formulations that deliver stronger roots, healthier leaves, and better yield.",
    price: "$59",
    period: "/month",
    artwork:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Plant Growth Enhancer",
      "Flower & Fruit Promoter",
      "BIO-NPK Granules",
      "Essential micronutrients",
      "Root strengthening support",
      "Soil conditioning formula",
      "Disease & pest resistance support",
      "Complete plant nutrition care",
    ],
    sectionLabel: "What's Included",
    cta: "Upgrade to Pro",
  },
  Government: {
    title: "Government Approved",
    badge: "Enterprise",
    description:
      "Manufactured with quality-focused processes and plant-safe organic ingredients for reliable gardening solutions. Trusted formulations designed to support healthy plants, healthy soil, and sustainable gardening.",
    price: "Custom",
    period: "",
    artwork:
      "https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Organic-based plant care",
      "Safe for regular plant use",
      "Suitable for all plant varieties",
      "Balanced nutrient formulations",
      "Supports eco-friendly gardening",
      "Gentle on roots & leaves",
      "Promotes sustainable growth",
      "Trusted gardening solutions since 2017",
    ],
    sectionLabel: "Highlights",
    cta: "Contact Sales",
  },
};

const avatars = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80",
];

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState("Researcher");
  const activePlan = planData[selectedPlan];

  return (
    <section id="pricing" className={styles.pricingSection}>
      <div className="container">
        <div className={styles.pricingGrid}>
          <div className={styles.pricingCopy}>
            <div className={styles.pricingKicker}>[PRICING]</div>
            <h2 className={styles.pricingTitle}>
            Nature’s 
              <span>Daily  Dose For Your Plants</span>
            </h2>
            <p className={styles.pricingLead}>
              Easy-to-use organic nutrition for healthier leaves, better immunity, and faster growth. Giving plants the right care they need to bloom beautifully. 
            </p>
            <div className={styles.pricingSocial}>
              <div className={styles.pricingAvatars} aria-hidden="true">
                {avatars.map((src) => (
                  <img key={src} className={styles.pricingAvatar} src={src} alt="" />
                ))}
              </div>

              <div className={styles.pricingTrust}>
                <div className={styles.pricingTrustRating}>
                  <span>*</span>
                  <span>5.0</span>
                </div>
                <div className={styles.pricingTrustText}>
                  Trusted by Researcher
                  <br />
                  Around the World
                </div>
              </div>
            </div>
          </div>

          <div className={styles.pricingPanel}>
            <div className={styles.pricingPills}>
              {Object.keys(planData).map((plan) => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => setSelectedPlan(plan)}
                  className={`${styles.pricingPill} ${
                    selectedPlan === plan ? styles.pricingPillActive : ""
                  }`}
                >
                  {plan}
                </button>
              ))}
            </div>

            <motion.article
              key={selectedPlan}
              className={styles.pricingCard}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div className={styles.pricingCardTop}>
                <div className={styles.pricingCardHeader}>
                  <div className={styles.pricingCardTitleRow}>
                    <h3 className={styles.pricingCardTitle}>{activePlan.title}</h3>
                    <span className={styles.pricingBadge}>{activePlan.badge}</span>
                  </div>
                  <p className={styles.pricingCardDesc}>{activePlan.description}</p>
                </div>

                <div className={styles.pricingArtwork} aria-hidden="true">
                  <img
                    className={styles.pricingArtworkImage}
                    src={activePlan.artwork}
                    alt=""
                  />
                </div>
              </div>

              <div className={styles.pricingDivider} />
              <div className={styles.pricingIncluded}>
                {activePlan.sectionLabel ?? "Advantages"} :
              </div>

              <div className={styles.pricingFeatures}>
                {activePlan.features.map((feature) => (
                  <div key={feature} className={styles.pricingFeature}>
                    <span className={styles.pricingFeatureIcon}>*</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.article>
          </div>
        </div>
      </div>
    </section>
  );
}
