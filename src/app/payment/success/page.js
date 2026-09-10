import Link from "next/link";

export const metadata = {
  title: "Payment successful",
};

export default function PaymentSuccessPage() {
  return (
    <main className="container" style={{ maxWidth: "720px", padding: "96px 16px", textAlign: "center" }}>
      <h1>Payment successful</h1>
      <p>Thank you. Your order has been received and payment has been verified.</p>
      <Link href="/" className="btn btn-success">Continue shopping</Link>
    </main>
  );
}
