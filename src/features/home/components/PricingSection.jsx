'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./pricing-section.module.css";

const planData = {
  Starter: {
    title: "Starter",
    badge: "For Individuals",
    description: "A lightweight plan for solo researchers and early-stage field work.",
    price: "$9",
    period: "/month",
    artwork:
      "https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Basic species recognition",
      "60 analyses per month",
      "Simple moisture indicators",
      "Email support",
    ],
    cta: "Start Free Trial",
  },
  Researcher: {
    title: "Researcher",
    badge: "Most Popular",
    description: "Built for field researchers and academic projects needing reliable, high-volume moss analysis.",
    price: "$29",
    period: "/month",
    artwork:
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Advanced species recognition",
      "300 analyses per month",
      "Pollution & moisture indicators",
      "Growth trend insights",
      "Map-based ecosystem visualization",
      "Priority processing",
      "Team workspace (up to 3 members)",
    ],
    cta: "Choose This Plan",
  },
  "Laboratory Pro": {
    title: "Laboratory Pro",
    badge: "For Labs",
    description: "A higher-volume plan for teams that need deeper analysis and reporting.",
    price: "$59",
    period: "/month",
    artwork:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Lab-grade analysis workflows",
      "900 analyses per month",
      "Advanced export reports",
      "Priority queue processing",
      "Multiple project spaces",
    ],
    cta: "Upgrade to Pro",
  },
  Government: {
    title: "Government",
    badge: "Enterprise",
    description: "Custom workflows for agencies, climate programs, and large-scale monitoring.",
    price: "Custom",
    period: "",
    artwork:
      "https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Multi-region monitoring",
      "Custom dashboards",
      "Enterprise security",
      "Dedicated support",
      "Custom integrations",
    ],
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
              Choose the Right Plan
              <span>for Your Research</span>
            </h2>
            <p className={styles.pricingLead}>
              Flexible plans for individual researchers, academic teams, and
              environmental organizations. Every tier includes core AI-powered moss
              identification and environmental analysis tools.
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
                  <div className={styles.pricingAmount}>
                    {activePlan.price}
                    {activePlan.period ? <span>{activePlan.period}</span> : null}
                  </div>
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
              <div className={styles.pricingIncluded}>What&apos;s Included :</div>

              <div className={styles.pricingFeatures}>
                {activePlan.features.map((feature) => (
                  <div key={feature} className={styles.pricingFeature}>
                    <span className={styles.pricingFeatureIcon}>*</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className={styles.pricingActions}>
                <a href="#contact" className={styles.pricingButton}>
                  {activePlan.cta}
                </a>
              </div>
            </motion.article>
          </div>
        </div>
      </div>
    </section>
  );
}
