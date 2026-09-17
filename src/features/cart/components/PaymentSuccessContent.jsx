"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CART_UPDATED_EVENT, clearCartItems } from "../cart-storage";

export default function PaymentSuccessContent() {
  useEffect(() => {
    clearCartItems();
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
  }, []);

  return (
    <main className="container" style={{ maxWidth: "720px", padding: "96px 16px", textAlign: "center" }}>
      <h1>Payment successful</h1>
      <p>Thank you. Your order has been received and payment has been verified.</p>
      <Link href="/" className="btn btn-success">Continue shopping</Link>
    </main>
  );
}
