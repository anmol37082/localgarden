import Link from "next/link";

export const metadata = {
  title: "Payment unsuccessful",
};

export default function PaymentFailurePage() {
  return (
    <main className="container" style={{ maxWidth: "720px", padding: "96px 16px", textAlign: "center" }}>
      <h1>Payment was not completed</h1>
      <p>No amount will be treated as paid until PayU verifies the payment. Please try again.</p>
      <Link href="/checkout" className="btn btn-success">Return to checkout</Link>
    </main>
  );
}
