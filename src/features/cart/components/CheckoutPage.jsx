'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CART_STORAGE_KEY,
  applyCartItemCoupon,
  clearCartItems,
  formatMoney,
  getCartItems,
  getCartTotals,
  CART_UPDATED_EVENT,
  updateCartItemQuantity,
} from "../cart-storage";
import { submitRowsToGoogleSheet } from "../../../lib/google-sheets";
import styles from "./checkout-page.module.css";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState(() => getCartItems());
  const [couponInputs, setCouponInputs] = useState(() => {
    try {
      const items = getCartItems();
      const map = {};
      items.forEach((item) => {
        map[item.id] = item.couponCode ?? "";
      });
      return map;
    } catch {
      return {};
    }
  });
  const [couponMessages, setCouponMessages] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const syncCart = () => setCartItems(getCartItems());

    const handleCartUpdated = () => syncCart();
    const handleStorageChange = (event) => {
      if (event.key === CART_STORAGE_KEY) {
        syncCart();
      }
    };

    syncCart();
    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Avoid calling setState synchronously inside effect to prevent cascading renders.
  // Coupon inputs are initialized from storage. When cartItems change, ensure any new
  // items have an entry by lazily filling missing keys on access (handled in JSX using ??).

  const { count: itemCount, total } = getCartTotals(cartItems);
  const canPlaceOrder = cartItems.length > 0;
  const shippingFee = itemCount > 0 ? 0 : 0;
  const grandTotal = total + shippingFee;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const notifyCartUpdated = () => {
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
  };

  const buildCheckoutRows = (items, customer) => {
    const submittedAt = new Date().toISOString();
    const orderId = `CHK-${Date.now()}`;

    return items.map((item) => {
      const quantity = Number(item.quantity) || 1;
      const baseUnitPrice = Number(item.baseUnitPrice ?? item.unitPrice) || 0;
      const finalUnitPrice = Number(item.unitPrice ?? item.baseUnitPrice) || 0;
      const basePrice = Number((baseUnitPrice * quantity).toFixed(2));
      const finalPrice = Number((finalUnitPrice * quantity).toFixed(2));

      return {
        orderId,
        submittedAt,
        customerName: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        productName: item.title ?? "",
        quantity,
        basePrice,
        discountAmount: Number((basePrice - finalPrice).toFixed(2)),
        couponApplied: item.couponCode ? "YES" : "NO",
        couponCode: item.couponCode || "",
        finalPrice,
        image: item.imageSrc ?? "",
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    if (!canPlaceOrder) {
      setSubmitError("Your cart is empty. Add a product before placing the order.");
      return;
    }

    setIsSubmitting(true);

    try {
      const rows = buildCheckoutRows(cartItems, formData);
      const submission = await submitRowsToGoogleSheet({
        sheetName: "Checkout",
        rows,
      });

      if (submission?.skipped) {
        throw new Error("Set NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL first.");
      }

      clearCartItems();
      setCartItems([]);
      setCouponInputs({});
      setCouponMessages({});
      notifyCartUpdated();
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to submit checkout data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const adjustQuantity = (itemId, delta) => {
    const currentItem = cartItems.find((item) => item.id === itemId);
    if (!currentItem) {
      return;
    }

    const nextQuantity = Math.max(1, (Number(currentItem.quantity) || 1) + delta);
    const nextItems = updateCartItemQuantity(itemId, nextQuantity);
    setCartItems(nextItems);
    notifyCartUpdated();
  };

  const handleCouponChange = (itemId, value) => {
    setCouponInputs((current) => ({ ...current, [itemId]: value }));
    setCouponMessages((current) => ({ ...current, [itemId]: "" }));
  };

  const applyCoupon = (itemId) => {
    const couponCode = couponInputs[itemId] ?? "";
    const normalizedCode = String(couponCode).trim().toLowerCase();

    if (normalizedCode !== "local10") {
      setCouponMessages((current) => ({
        ...current,
        [itemId]: "Use LOCAL10 to get 10% off.",
      }));
      return;
    }

    const nextItems = applyCartItemCoupon(itemId, couponCode);
    setCartItems(nextItems);
    notifyCartUpdated();
    setCouponMessages((current) => ({
      ...current,
      [itemId]: "10% discount applied.",
    }));
  };

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.headerRow}>
          <div>
            <div className={styles.kicker}>Final checkout</div>
            <h1 className={styles.title}>Double-check everything, then place your order in one clean step</h1>
            <p className={styles.subtitle}>
              Take a final look at your products, quantities, and discounts before confirming your order.
              Everything is kept simple and easy to review.
            </p>
          </div>
        </div>

        {submitted ? (
            <section className={styles.successCard}>
            <div className={styles.successBadge}>Order placed</div>
            <h2 className={styles.successTitle}>Your order has been captured successfully.</h2>
            <p className={styles.successText}>
              Thanks for placing your order. You can return to the home page and continue shopping anytime.
            </p>
            <Link href="/" className={styles.successButton}>
              Back to home
            </Link>
          </section>
        ) : (
          <div className={styles.checkoutGrid}>
            <section className={styles.formCard}>
              <h2 className={styles.cardTitle}>Shipping details</h2>

              <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.field}>
                  <span>Full name</span>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </label>

                <label className={styles.field}>
                  <span>Email</span>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </label>

                <label className={styles.field}>
                  <span>Phone</span>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </label>

                <label className={styles.field}>
                  <span>Address</span>
                  <textarea name="address" value={formData.address} onChange={handleInputChange} rows={4} required />
                </label>

                {submitError ? <div className={styles.couponMessageError}>{submitError}</div> : null}

                <button type="submit" className={styles.placeOrderButton} disabled={!canPlaceOrder || isSubmitting}>
                  {isSubmitting ? "Sending..." : "Place order"}
                </button>
              </form>
            </section>

            <aside className={styles.summaryCard}>
              <h2 className={styles.cardTitle}>Order summary</h2>

              {cartItems.length > 0 ? (
                <div className={styles.summaryList}>
                  {cartItems.map((item) => (
                    <article key={item.id} className={styles.summaryItem}>
                      <div className={styles.summaryImageWrap}>
                        <Image
                          src={item.imageSrc}
                          alt={item.imageAlt}
                          fill
                          sizes="72px"
                          className={styles.summaryImage}
                        />
                      </div>

                      <div className={styles.summaryBody}>
                        <div className={styles.summaryTitle}>{item.title}</div>
                        <div className={styles.quantityRow}>
                          <button
                            type="button"
                            className={styles.quantityButton}
                            onClick={() => adjustQuantity(item.id, -1)}
                            aria-label={`Decrease quantity of ${item.title}`}
                          >
                            -
                          </button>
                          <span className={styles.quantityValue}>{item.quantity}</span>
                          <button
                            type="button"
                            className={styles.quantityButton}
                            onClick={() => adjustQuantity(item.id, 1)}
                            aria-label={`Increase quantity of ${item.title}`}
                          >
                            +
                          </button>
                        </div>

                        <div className={styles.couponRow}>
                          <input
                            type="text"
                            className={styles.couponInput}
                            placeholder="local10"
                            value={couponInputs[item.id] ?? item.couponCode ?? ""}
                            onChange={(event) => handleCouponChange(item.id, event.target.value)}
                            aria-label={`Coupon code for ${item.title}`}
                          />
                          <button
                            type="button"
                            className={styles.couponButton}
                            onClick={() => applyCoupon(item.id)}
                          >
                            {item.couponCode === "LOCAL10" ? "Applied" : "Apply"}
                          </button>
                        </div>

                        {couponMessages[item.id] ? (
                          <div
                            className={`${styles.couponMessage} ${
                              couponMessages[item.id].includes("applied")
                                ? styles.couponMessageSuccess
                                : styles.couponMessageError
                            }`}
                          >
                            {couponMessages[item.id]}
                          </div>
                        ) : null}
                      </div>

                      <div className={styles.summaryPrice}>
                        <strong>{formatMoney((Number(item.unitPrice) || 0) * (Number(item.quantity) || 1))}</strong>
                        {Number(item.discountPercent) > 0 ? (
                          <span className={styles.summaryOriginalPrice}>
                            {formatMoney((Number(item.baseUnitPrice ?? item.unitPrice) || 0) * (Number(item.quantity) || 1))}
                          </span>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyBadge}>Empty</div>
                  <p className={styles.emptyText}>
                    Your cart is empty. Add a product from home or the product detail page to continue.
                  </p>
                </div>
              )}

              <div className={styles.totals}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <strong>{formatMoney(total)}</strong>
                </div>
                <div className={styles.totalRow}>
                  <span>Shipping</span>
                  <strong>{shippingFee === 0 ? "Free" : formatMoney(shippingFee)}</strong>
                </div>
                <div className={`${styles.totalRow} ${styles.totalRowFinal}`}>
                  <span>Total</span>
                  <strong>{formatMoney(grandTotal)}</strong>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
