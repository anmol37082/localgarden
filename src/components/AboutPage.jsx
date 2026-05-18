import Link from "next/link";
import { FiCheckCircle, FiGrid, FiSettings } from "react-icons/fi";

export default function AboutPage() {
  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="mb-4">
            <span className="badge text-bg-dark rounded-pill px-3 py-2 mb-3">
              About
            </span>
            <h1 className="display-5 fw-bold">What is included here</h1>
            <p className="lead text-secondary mb-0">
              A practical starter stack with Next.js App Router and Bootstrap so
              the app is usable from day one.
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                icon: FiGrid,
                title: "Bootstrap layout",
                text: "Responsive spacing, grid, cards, buttons, and a top nav are already set up.",
              },
              {
                icon: FiSettings,
                title: "Modern routing",
                text: "The app uses the App Router, which is the current Next.js direction.",
              },
              {
                icon: FiCheckCircle,
                title: "Ready to build",
                text: "You can add dashboards, auth, forms, or APIs without rewriting the shell.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div className="col-md-4" key={title}>
                <div className="card h-100 border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">
                    <div className="feature-badge mb-3">
                      <Icon />
                    </div>
                    <h2 className="h5">{title}</h2>
                    <p className="text-secondary mb-0">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 d-flex gap-3 flex-wrap">
            <Link href="/" className="btn btn-dark rounded-pill px-4">
              Back home
            </Link>
            <Link href="/contact" className="btn btn-outline-dark rounded-pill px-4">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
