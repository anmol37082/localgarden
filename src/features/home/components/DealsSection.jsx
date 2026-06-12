'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { createRazorpayOrder, submitRowsToGoogleSheet } from "../../../lib/google-sheets";
import styles from "./deals-section.module.css";

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "rzp_test_T0JAeAYR2bWq0a";
const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let razorpayScriptPromise = null;

const comboProducts = {
  "Plant Growth Enhancer": { originalPrice: 520, image: "/growth%20enhancer/Artboard%201.png" },
  "Flower & Fruit Booster": {
    originalPrice: 520,
    image: "/fruit%20and%20flower%20booster/Artboard%201.png",
  },
  "Bio NPK Granules": { originalPrice: 450, image: "/BIo%20npk/Artboard%201.png" },
};

const formatPrice = (value) => `Rs. ${value.toFixed(2)}`;

const parseMoneyValue = (value) => {
  const normalized = String(value ?? "").replace(/[^0-9.-]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

function loadRazorpayScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay can only load in the browser."));
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_SRC}"]`);

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Unable to load Razorpay checkout.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Unable to load Razorpay checkout."));
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}

const buildComboDeal = (comboItems, image) => {
  const originalTotal = comboItems.reduce((sum, item) => sum + comboProducts[item].originalPrice, 0);
  const currentTotal = originalTotal * 0.8;

  return {
    title: comboItems.join(" + "),
    label: `${comboItems.length} Product Combo`,
    currentPriceValue: Number(currentTotal.toFixed(2)),
    originalPriceValue: Number(originalTotal.toFixed(2)),
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    alternateMobile: "",
    pincode: "",
    houseFlatBuildingNumber: "",
    areaStreetLocality: "",
    cityDistrict: "",
    state: "",
    landmark: "",
  });

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

  const closeModal = () => {
    setIsThanksVisible(false);
    setSelectedDeal(null);
    setSubmitError("");
    setFormData({
      name: "",
      mobile: "",
      alternateMobile: "",
      pincode: "",
      houseFlatBuildingNumber: "",
      areaStreetLocality: "",
      cityDistrict: "",
      state: "",
      landmark: "",
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const buildCombinedAddress = (customer) => {
    return [
      customer.houseFlatBuildingNumber,
      customer.areaStreetLocality,
      customer.cityDistrict,
      customer.state,
      customer.pincode,
      customer.landmark,
    ]
      .map((value) => String(value ?? "").trim())
      .filter(Boolean)
      .join(", ");
  };

  const handleBuyNow = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      if (!selectedDeal) {
        throw new Error("No deal selected.");
      }

      const amountInPaise = Math.round(
        Number(selectedDeal.currentPriceValue ?? parseMoneyValue(selectedDeal.currentPrice)) * 100,
      );
      const receiptId = `COMBO-${Date.now()}`;
      const orderResponse = await createRazorpayOrder({
        amount: amountInPaise,
        currency: "INR",
        receiptId,
      });
      const razorpayOrderId = orderResponse.orderId ?? orderResponse.id;

      if (!razorpayOrderId) {
        throw new Error("Unable to create Razorpay order.");
      }

      await loadRazorpayScript();

      const checkoutOptions = {
        key: RAZORPAY_KEY_ID,
        amount: amountInPaise,
        currency: "INR",
        name: "Local Garden",
        description: "Combo deal payment",
        image: "/weblogo.png",
        order_id: razorpayOrderId,
        prefill: {
          name: formData.name,
          contact: formData.mobile,
        },
        notes: {
          receiptId,
          dealName: selectedDeal.title,
          comboItems: selectedDeal.comboItems.join(" | "),
          customerName: formData.name,
          customerMobile: formData.mobile,
          alternateMobile: formData.alternateMobile,
          address: buildCombinedAddress(formData),
        },
        theme: {
          color: "#1f7a5f",
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
        handler: async (response) => {
          try {
            const submission = await submitRowsToGoogleSheet({
              sheetName: "ComboDeals",
              rows: [
                {
                  submittedAt: new Date().toISOString(),
                  orderId: receiptId,
                  paymentStatus: "PAID",
                  paymentId: response?.razorpay_payment_id ?? "",
                  paymentOrderId: response?.razorpay_order_id ?? razorpayOrderId,
                  paymentSignature: response?.razorpay_signature ?? "",
                  dealName: selectedDeal.title,
                  comboItems: selectedDeal.comboItems.join(" | "),
                  currentPrice: selectedDeal.currentPrice,
                  originalPrice: selectedDeal.originalPrice,
                  discountPercent: selectedDeal.discountPercent,
                  name: formData.name,
                  mobile: formData.mobile,
                  alternateMobile: formData.alternateMobile,
                  address: buildCombinedAddress(formData),
                  pincode: formData.pincode,
                  houseFlatBuildingNumber: formData.houseFlatBuildingNumber,
                  areaStreetLocality: formData.areaStreetLocality,
                  cityDistrict: formData.cityDistrict,
                  state: formData.state,
                  landmark: formData.landmark,
                },
              ],
            });

            if (submission?.skipped) {
              throw new Error("Set NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL first.");
            }

            setIsThanksVisible(true);
          } catch (error) {
            setSubmitError(error instanceof Error ? error.message : "Failed to submit combo deal.");
          } finally {
            setIsSubmitting(false);
          }
        },
      };

      const checkout = new window.Razorpay(checkoutOptions);
      checkout.open();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to submit combo deal.");
    }
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
          <div className={styles.dealsKicker}>Today&apos;s Deals</div>
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
                      <div className={styles.dealPriceGroup}>
                        <div className={styles.dealCurrent}>{item.currentPrice}</div>
                        <div className={styles.dealOriginal}>{item.originalPrice}</div>
                      </div>
                      <div className={styles.dealBadge}>{item.discountPercent}</div>
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
            className={`${styles.modal} ${isThanksVisible ? styles.modalThanks : ""}`}
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
                <div className={styles.thanksBadge} aria-label="Success" role="img">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.thanksIcon}>
                    <path
                      d="M20 6 9 17l-5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
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
              <form className={styles.modalDetails} onSubmit={handleBuyNow}>
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
                </div>

                <div className={styles.modalInfo}>
                  <div className={styles.modalInfoRow}>
                    <span><span className={styles.requiredMark}>*</span> Name</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter name"
                      className={styles.modalInput}
                      required
                    />
                  </div>
                  <div className={styles.modalInfoRow}>
                    <span><span className={styles.requiredMark}>*</span> Mob</span>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="Enter mobile number"
                      className={styles.modalInput}
                      required
                    />
                  </div>
                  <div className={styles.modalInfoRow}>
                    <span><span className={styles.requiredMark}>*</span> Mobile Alternative</span>
                    <input
                      type="tel"
                      name="alternateMobile"
                      value={formData.alternateMobile}
                      onChange={handleInputChange}
                      placeholder="Enter alternative mobile number"
                      className={styles.modalInput}
                      required
                    />
                  </div>
                  <div className={styles.modalInfoRow}>
                    <span><span className={styles.requiredMark}>*</span> Pincode</span>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="Enter pincode"
                      className={styles.modalInput}
                      required
                    />
                  </div>
                  <div className={styles.modalInfoRow}>
                    <span><span className={styles.requiredMark}>*</span> House/Flat/Building Number</span>
                    <input
                      type="text"
                      name="houseFlatBuildingNumber"
                      value={formData.houseFlatBuildingNumber}
                      onChange={handleInputChange}
                      placeholder="Enter house / flat / building number"
                      className={styles.modalInput}
                      required
                    />
                  </div>
                  <div className={styles.modalInfoRow}>
                    <span><span className={styles.requiredMark}>*</span> Area/Street/Locality</span>
                    <input
                      type="text"
                      name="areaStreetLocality"
                      value={formData.areaStreetLocality}
                      onChange={handleInputChange}
                      placeholder="Enter area / street / locality"
                      className={styles.modalInput}
                      required
                    />
                  </div>
                  <div className={styles.modalInfoRow}>
                    <span><span className={styles.requiredMark}>*</span> City/District</span>
                    <input
                      type="text"
                      name="cityDistrict"
                      value={formData.cityDistrict}
                      onChange={handleInputChange}
                      placeholder="Enter city / district"
                      className={styles.modalInput}
                      required
                    />
                  </div>
                  <div className={styles.modalInfoRow}>
                    <span><span className={styles.requiredMark}>*</span> State</span>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Enter state"
                      className={styles.modalInput}
                      required
                    />
                  </div>
                  <div className={styles.modalInfoRow}>
                    <span className={styles.labelLine}>
                      <span>Landmark</span>
                      <span className={styles.optionalText}>(optional)</span>
                    </span>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      placeholder="Enter landmark"
                      className={styles.modalInput}
                    />
                  </div>
                  <button type="submit" className={styles.buyNowButton} disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Buy Now"}
                  </button>
                  {submitError ? <div className={styles.thanksText}>{submitError}</div> : null}
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
