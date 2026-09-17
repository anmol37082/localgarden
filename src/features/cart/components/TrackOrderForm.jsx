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
  return <section className={styles.track}><h2>Track your order</h2><p>Enter the same mobile number used at checkout.</p><form onSubmit={submit} className={styles.trackForm}><input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Your order ID" required /><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your mobile number" inputMode="numeric" required /><button disabled={loading}>{loading ? "Checking..." : "Track order"}</button></form>{error ? <p className={styles.error}>{error}</p> : null}{result ? <div className={styles.result}><strong>{result.status} · {result.type}</strong><div>Order ID: {result.orderId}</div><div>{result.name} · {result.phone}</div><div>{result.items.join(", ")}</div></div> : null}</section>;
}
