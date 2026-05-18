import { FiMail, FiMessageCircle, FiPhone } from "react-icons/fi";

export default function ContactPage() {
  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-body p-4 p-lg-5">
              <span className="badge text-bg-warning text-dark rounded-pill px-3 py-2 mb-3">
                Contact
              </span>
              <h1 className="display-6 fw-bold">Simple starter contact page</h1>
              <p className="text-secondary mb-4">
                Replace these placeholders with your real contact details or a form.
              </p>

              <div className="row g-3">
                {[
                  { icon: FiMail, label: "Email", value: "hello@example.com" },
                  { icon: FiPhone, label: "Phone", value: "+91 00000 00000" },
                  { icon: FiMessageCircle, label: "Support", value: "Mon-Fri, 9am to 6pm" },
                ].map(({ icon: Icon, label, value }) => (
                  <div className="col-md-4" key={label}>
                    <div className="contact-pill">
                      <Icon className="me-2" />
                      <div>
                        <div className="fw-semibold">{label}</div>
                        <div className="text-secondary small">{value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
