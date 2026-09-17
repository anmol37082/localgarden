"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CART_UPDATED_EVENT, clearCartItems, getPendingPaymentOrder } from "../cart-storage";
import TrackOrderForm from "./TrackOrderForm";
import styles from "./payment-status.module.css";

export default function PaymentSuccessContent() {
  const [order] = useState(() => {
    if (typeof window === "undefined") return null;
    const saved = getPendingPaymentOrder();
    const orderId = new URLSearchParams(window.location.search).get("orderId");
    return saved && saved.orderId === orderId ? saved : { orderId, name: "", phone: "" };
  });
  useEffect(() => {
    clearCartItems();
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
  }, []);

  const copyOrderId = async () => { if (order?.orderId) await navigator.clipboard.writeText(order.orderId); };

  return (
    <main className={`container ${styles.page}`}>
      <section className={styles.card}><div className={styles.confetti} aria-hidden="true">{Array.from({ length: 28 }, (_, index) => <i key={index} style={{ left: `${(index * 17) % 100}%`, animationDelay: `${index * 45}ms` }} />)}</div><div className={styles.successMark} aria-label="Payment verified"><svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="23"/><path d="M14 27l7 7 16-16"/></svg></div><h1>Payment successful</h1><p>Thank you. Your order has been received and payment has been verified.</p>
      {order?.orderId ? <><div className={styles.orderId}><span>{order.orderId}</span><button onClick={copyOrderId}>Copy</button></div><p>Name: {order.name || "—"}<br />Mobile: {order.phone || "—"}</p><p className={styles.warning}>Order ID sirf abhi show ho rahi hai. Isse copy karke safe jagah par rakh lijiye.</p></> : null}
      <Link href="/" className="btn btn-success">Continue shopping</Link></section>
      <TrackOrderForm initialOrderId={order?.orderId} initialPhone={order?.phone} />
    </main>
  );
}
