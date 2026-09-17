"use client";

import { useState } from "react";
import { trackOrder } from "../../../lib/google-sheets";
import styles from "./payment-status.module.css";

export default function TrackOrderForm({ initialOrderId = "", initialPhone = "" }) {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [phone, setPhone] = useState(initialPhone);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError(""); setResult(null);
    try { setResult((await trackOrder({ orderId, phone })).order); } catch (err) { setError(err.message || "Unable to find your order."); } finally { setLoading(false); }
  };

  return <section className={styles.track}><div className={styles.trackKicker}>Order support</div><h2>Track your order</h2><p className={styles.trackIntro}>Enter your order ID and the mobile number used while placing the order.</p><form onSubmit={submit} className={styles.trackForm}><label>Order ID<input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="e.g. CHK-123456789" required /></label><label>Mobile number<input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your 10-digit mobile number" inputMode="numeric" required /></label><button disabled={loading}>{loading ? "Checking order..." : "Track order"}</button></form>{error ? <p className={styles.error}>{error}</p> : null}{result ? <div className={styles.result}><div className={styles.resultTop}><span className={styles.statusBadge}>{result.status}</span><span className={styles.verified}>Payment verified</span></div><div className={styles.resultGrid}><div><small>ORDER ID</small><strong>{result.orderId}</strong></div><div><small>CUSTOMER</small><strong>{result.name}</strong></div><div><small>MOBILE</small><strong>{result.phone}</strong></div><div><small>ORDER ITEMS</small><strong>{result.items.join(", ")}</strong></div></div></div> : null}</section>;
}
