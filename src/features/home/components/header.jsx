'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CART_STORAGE_KEY,
  CART_UPDATED_EVENT,
  getCartItems,
  getCartTotals,
  removeCartItem,
} from "../../cart/cart-storage";
import styles from "./header.module.css";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#products", label: "Products" },
  { href: "/#about", label: "About" },
];

function CartIcon() {
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 122.88 107.54"
      aria-hidden="true"
      className={styles.cartIcon}
    >
      <title>trolley</title>
      <path d="M3.93,7.86A3.93,3.93,0,0,1,3.93,0H14.15l.39,0A18.28,18.28,0,0,1,24.1,2.49a14.69,14.69,0,0,1,6.41,9.1c.32,1.41.66,2.82,1,4.23H119a3.92,3.92,0,0,1,3.93,3.92,4,4,0,0,1-.19,1.22L112.52,62.08a3.92,3.92,0,0,1-3.8,3H44.66c1.44,5.21,2.76,8,4.7,9.34,2.27,1.52,6.31,1.63,13,1.52h.07v0h45.17a3.93,3.93,0,1,1,0,7.86H62.46v0c-8.27.15-13.38-.09-17.46-2.84s-6.36-7.55-8.57-16.3l-13.51-51a7.19,7.19,0,0,0-3-4.49,10.8,10.8,0,0,0-5.51-1.3H3.93ZM96,88.34a9.6,9.6,0,1,1-9.6,9.6,9.6,9.6,0,0,1,9.6-9.6Zm-42.1,0a9.6,9.6,0,1,1-9.6,9.6,9.6,9.6,0,0,1,9.6-9.6ZM78,23.67V38h32.45l3.53-14.28Zm0,22.14V57.22h27.69l2.82-11.41ZM70.11,57.22V45.81H39.63q1.57,5.7,3,11.41Zm0-19.27V23.67H33.54c1.26,4.76,2.58,9.52,3.91,14.28Z" />
    </svg>
  );
}

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => getCartItems());

  const syncCart = () => setCartItems(getCartItems());

  const closeDrawer = () => setDrawerOpen(false);
  const openCart = () => {
    setDrawerOpen(false);
    syncCart();
    setCartOpen(true);
  };
  const closeCart = () => setCartOpen(false);
  const handleRemoveItem = (itemId) => {
    removeCartItem(itemId);
    syncCart();
  };

  useEffect(() => {
    const handleCartUpdated = (event) => {
      syncCart();
      if (event.detail?.openCart) {
        setCartOpen(true);
      }
    };

    const handleStorageChange = (event) => {
      if (event.key === CART_STORAGE_KEY) {
        syncCart();
      }
    };

    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!drawerOpen && !cartOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") {
        return;
      }

      if (cartOpen) {
        closeCart();
        return;
      }

      closeDrawer();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawerOpen, cartOpen]);

  const { count: cartCount, total: cartTotal } = getCartTotals(cartItems);

  return (
    <header className={styles.header}>
      {drawerOpen ? (
        <div className={styles.mobileTopBar}>
          <Link href="/" className={styles.mobileBrand} aria-label="PlantBoost home" onClick={closeDrawer}>
            <Image
              src="/locaralgardentextimg.png"
              alt="Local Garden"
              width={180}
              height={52}
              className={styles.mobileBrandImage}
              priority
            />
          </Link>

          <button
            type="button"
            className={styles.mobileCloseButton}
            aria-label="Close menu"
            onClick={closeDrawer}
          >
            <span className={styles.menuIcon} aria-hidden="true">
              X
            </span>
          </button>
        </div>
      ) : null}

      <div className="container-fluid">
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand} aria-label="PlantBoost home">
            <Image
              src="/locaralgardentextimg.png"
              alt="Local Garden"
              width={220}
              height={64}
              className={styles.brandImage}
              priority
            />
          </Link>

          <nav className={styles.nav} aria-label="Primary">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className={styles.navLink}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cartButton}
              aria-label="Open shopping cart"
              aria-expanded={cartOpen}
              aria-controls="header-cart-modal"
              onClick={openCart}
            >
              <CartIcon />
            </button>
          </div>

          <div className={styles.mobileActions}>
            <button
              type="button"
              className={styles.cartButton}
              aria-label="Open shopping cart"
              aria-expanded={cartOpen}
              aria-controls="header-cart-modal"
              onClick={openCart}
            >
              <CartIcon />
            </button>

            <button
              type="button"
              className={`${styles.menuButton} ${drawerOpen ? styles.menuButtonHidden : ""}`}
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              onClick={() => setDrawerOpen((open) => !open)}
            >
              <span className={styles.menuIcon} aria-hidden="true">
                {drawerOpen ? "×" : "☰"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${styles.drawerBackdrop} ${drawerOpen ? styles.drawerBackdropOpen : ""}`}
        onClick={closeDrawer}
      />

      <aside
        id="mobile-drawer"
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}
        aria-hidden={!drawerOpen}
      >
        <nav className={styles.drawerNav} aria-label="Mobile primary">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className={styles.drawerLink} onClick={closeDrawer}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.drawerActions}>
          <button
            type="button"
            className={styles.cartButton}
            aria-label="Open shopping cart"
            aria-expanded={cartOpen}
            aria-controls="header-cart-modal"
            onClick={openCart}
          >
            <CartIcon />
          </button>
        </div>
      </aside>

      {cartOpen ? (
        <div className={styles.cartBackdrop} role="presentation" onClick={closeCart}>
          <section
            id="header-cart-modal"
            className={styles.cartModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="header-cart-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className={styles.cartCloseButton} aria-label="Close cart" onClick={closeCart}>
              X
            </button>

            <div className={styles.cartModalBody}>
              <div className={styles.cartKicker}>Shopping cart</div>
              <h2 id="header-cart-title" className={styles.cartTitle}>
                {cartCount > 0 ? `${cartCount} item${cartCount === 1 ? "" : "s"} in your cart` : "Your cart is empty"}
              </h2>
              <p className={styles.cartText}>
                {cartCount > 0
                  ? "Nice choice. Add a few more items to complete your cart and keep building your order."
                  : "Start your cart now. Pick a product you like and see it appear here instantly."}
              </p>

              {cartItems.length > 0 ? (
                <div className={styles.cartItemList}>
                  {cartItems.map((item) => (
                    <article key={item.id} className={styles.cartItem}>
                      <div className={styles.cartItemImageWrap}>
                        <Image
                          src={item.imageSrc}
                          alt={item.imageAlt}
                          fill
                          sizes="80px"
                          className={styles.cartItemImage}
                        />
                      </div>

                      <div className={styles.cartItemBody}>
                        <div className={styles.cartItemTitle}>{item.title}</div>
                        <div className={styles.cartItemMeta}>
                          <span className={styles.cartColorDot} style={{ backgroundColor: item.colorHex }} />
                          <span>{item.colorName}</span>
                          <span>Qty {item.quantity}</span>
                        </div>
                      </div>

                      <div className={styles.cartItemPrice}>
                        <span>{item.priceLabel}</span>
                      </div>

                      <button
                        type="button"
                        className={styles.cartItemRemove}
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        Remove
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className={styles.cartEmptyState}>
                  <div className={styles.cartEmptyBadge}>0 items</div>
                  <div>
                    <div className={styles.cartEmptyTitle}>No items yet</div>
                    <div className={styles.cartEmptyText}>Browse products to start building your cart.</div>
                  </div>
                </div>
              )}

              <div className={styles.cartSummary}>
                <span>Total</span>
                <strong>{cartCount > 0 ? `$${cartTotal.toFixed(2)}` : "$0.00"}</strong>
              </div>

              <div className={styles.cartActions}>
                <Link href="/checkout" className={styles.cartPrimaryAction} onClick={closeCart}>
                  Checkout
                </Link>
                <button type="button" className={styles.cartSecondaryAction} onClick={closeCart}>
                  Continue shopping
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </header>
  );
}
