'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CART_STORAGE_KEY,
  applyCartItemCoupon,
  formatMoney,
  getCartItems,
  getCartTotals,
  savePendingPaymentOrder,
  CART_UPDATED_EVENT,
  updateCartItemQuantity,
} from "../cart-storage";
import {
  createPayUCheckout,
  redirectToPayUCheckout,
  stagePayUOrder,
} from "../../../lib/google-sheets";
import styles from "./checkout-page.module.css";

export default function CheckoutPage() {
  // Keep the initial browser render identical to the static HTML. Cart data is
  // stored in localStorage, which is only available after the component mounts.
  const [cartItems, setCartItems] = useState([]);
  const [couponInputs, setCouponInputs] = useState({});
  const [couponMessages, setCouponMessages] = useState({});
  const [submitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pincode: "",
    houseFlatBuildingNumber: "",
    areaStreetLocality: "",
    cityDistrict: "",
    state: "",
    landmark: "",
  });

  useEffect(() => {
    const syncCart = () => {
      const items = getCartItems();
      setCartItems(items);
      setCouponInputs(
        items.reduce((inputs, item) => {
          inputs[item.id] = item.couponCode ?? "";
          return inputs;
        }, {}),
      );
    };

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

  // Reset the pending UI if this page is restored after the customer leaves
  // the hosted PayU page using the browser Back button.
  useEffect(() => {
    const resetSubmittingState = () => setIsSubmitting(false);
    window.addEventListener("pageshow", resetSubmittingState);

    return () => window.removeEventListener("pageshow", resetSubmittingState);
  }, []);

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

  const buildCheckoutRows = (items, customer) => {
    const submittedAt = new Date().toISOString();
    const orderId = `CHK-${Date.now()}`;
    const combinedAddress = buildCombinedAddress(customer);

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
        address: combinedAddress,
        pincode: customer.pincode,
        houseFlatBuildingNumber: customer.houseFlatBuildingNumber,
        areaStreetLocality: customer.areaStreetLocality,
        cityDistrict: customer.cityDistrict,
        state: customer.state,
        landmark: customer.landmark,
        productName: item.title ?? "",
        quantity,
        basePrice,
        discountAmount: Number((basePrice - finalPrice).toFixed(2)),
        couponApplied: item.couponCode ? "YES" : "NO",
        couponCode: item.couponCode || "",
        finalPrice,
        image: item.imageSrc ?? "",
        paymentStatus: "PENDING",
        paymentId: "",
        paymentOrderId: "",
        paymentSignature: "",
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
      const transactionId = `CHK-${Date.now()}`;
      const rows = buildCheckoutRows(cartItems, formData).map((row) => ({
        ...row,
        orderId: transactionId,
        paymentStatus: "PENDING",
        paymentOrderId: transactionId,
      }));

      const submission = await stagePayUOrder({
        sheetName: "Checkout",
        rows,
        payment: {
          txnid: transactionId,
          amount: grandTotal,
          productinfo: `Local Garden order (${itemCount} item${itemCount === 1 ? "" : "s"})`,
          firstname: formData.name,
          email: formData.email,
          phone: formData.phone,
          udf1: "Checkout",
          udf2: transactionId,
        },
      });

      if (submission?.skipped) {
        throw new Error("Set NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL first.");
      }

      const checkout = await createPayUCheckout({
        amount: grandTotal,
        txnid: transactionId,
        productinfo: `Local Garden order (${itemCount} item${itemCount === 1 ? "" : "s"})`,
        firstname: formData.name,
        email: formData.email,
        phone: formData.phone,
        udf1: "Checkout",
        udf2: transactionId,
      });

      savePendingPaymentOrder({ orderId: transactionId, name: formData.name, phone: formData.phone });

      redirectToPayUCheckout(checkout);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to submit checkout data.");
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
                <div className={styles.formRow}>
                  <label className={styles.field}>
                    <span><span className={styles.requiredMark}>*</span> Full name</span>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                  </label>

                  <label className={styles.field}>
                    <span><span className={styles.requiredMark}>*</span> Email</span>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                  </label>
                </div>

                <div className={styles.formRow}>
                  <label className={styles.field}>
                    <span><span className={styles.requiredMark}>*</span> Phone</span>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
                  </label>

                  <label className={styles.field}>
                    <span><span className={styles.requiredMark}>*</span> Pincode</span>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required />
                  </label>
                </div>

                <div className={styles.formRow}>
                  <label className={styles.field}>
                    <span><span className={styles.requiredMark}>*</span> House/Flat/Building Number</span>
                    <input
                      type="text"
                      name="houseFlatBuildingNumber"
                      value={formData.houseFlatBuildingNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <span><span className={styles.requiredMark}>*</span> Area/Street/Locality</span>
                    <input
                      type="text"
                      name="areaStreetLocality"
                      value={formData.areaStreetLocality}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>

                <div className={styles.formRow}>
                  <label className={styles.field}>
                    <span><span className={styles.requiredMark}>*</span> City/District</span>
                    <input
                      type="text"
                      name="cityDistrict"
                      value={formData.cityDistrict}
                      onChange={handleInputChange}
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <span><span className={styles.requiredMark}>*</span> State</span>
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} required />
                  </label>
                </div>

                <label className={styles.field}>
                  <span className={styles.labelLine}>
                    <span>Landmark</span>
                    <span className={styles.optionalText}>(optional)</span>
                  </span>
                  <input type="text" name="landmark" value={formData.landmark} onChange={handleInputChange} />
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
