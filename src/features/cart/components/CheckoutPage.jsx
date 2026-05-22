'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CART_STORAGE_KEY,
  clearCartItems,
  formatMoney,
  getCartItems,
  getCartTotals,
  CART_UPDATED_EVENT,
  updateCartItemQuantity,
} from "../cart-storage";
import styles from "./checkout-page.module.css";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState(() => getCartItems());
  const [submitted, setSubmitted] = useState(false);
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

  const { count: itemCount, total } = getCartTotals(cartItems);
  const shippingFee = itemCount > 0 ? 0 : 0;
  const grandTotal = total + shippingFee;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    clearCartItems();
    setCartItems([]);
    setSubmitted(true);
  };

  const adjustQuantity = (itemId, delta) => {
    const currentItem = cartItems.find((item) => item.id === itemId);
    if (!currentItem) {
      return;
    }

    const nextQuantity = Math.max(1, (Number(currentItem.quantity) || 1) + delta);
    const nextItems = updateCartItemQuantity(itemId, nextQuantity);
    setCartItems(nextItems);
  };

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.headerRow}>
          <div>
            <div className={styles.kicker}>Checkout</div>
            <h1 className={styles.title}>Review your order and finish in one step</h1>
            <p className={styles.subtitle}>
              No backend is needed here. Your cart is stored locally and this page gives you a clean final review.
            </p>
          </div>
        </div>

        {submitted ? (
          <section className={styles.successCard}>
            <div className={styles.successBadge}>Order placed</div>
            <h2 className={styles.successTitle}>Your order has been captured locally.</h2>
            <p className={styles.successText}>
              This demo keeps everything on the client side, so you can test the checkout flow without a server.
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

                <button type="submit" className={styles.placeOrderButton}>
                  Place order
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
                        <div className={styles.summaryMeta}>
                          <span>{item.colorName}</span>
                        </div>
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
                      </div>

                      <div className={styles.summaryPrice}>{item.priceLabel}</div>
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
