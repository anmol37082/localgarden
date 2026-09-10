'use client';

import styles from "./product-comparison-section.module.css";

const comparisonRows = [
  {
    label: "Product quality",
    localProducts: { tone: "muted", text: "Mixed quality" },
    localGarden: { tone: "good", text: "Quality-focused products" },
    others: { tone: "muted", text: "Inconsistent" },
  },
  {
    label: "Product effectiveness",
    localProducts: { tone: "muted", text: "Varies by product" },
    localGarden: { tone: "good", text: "Performance-focused" },
    others: { tone: "muted", text: "May vary" },
  },
  {
    label: "Product selection",
    localProducts: { tone: "muted", text: "Limited range" },
    localGarden: { tone: "good", text: "Curated product range" },
    others: { tone: "muted", text: "Wide but inconsistent" },
  },
  {
    label: "Product guidance",
    localProducts: { tone: "muted", text: "Limited guidance" },
    localGarden: { tone: "good", text: "Simple usage guidance" },
    others: { tone: "muted", text: "Varies by seller" },
  },
  {
    label: "Value for money",
    localProducts: { tone: "muted", text: "Depends on vendor" },
    localGarden: { tone: "good", text: "Quality + value focused" },
    others: { tone: "muted", text: "Often price-focused" },
  },
  {
    label: "After-sale support",
    localProducts: { tone: "muted", text: "Limited support" },
    localGarden: { tone: "good", text: "Expert product support" },
    others: { tone: "muted", text: "Usually limited" },
  },
  {
    label: "Quality assurance",
    localProducts: { tone: "muted", text: "No clear promise" },
    localGarden: { tone: "good", text: "Quality-focused assurance" },
    others: { tone: "muted", text: "Varies by seller" },
  },
  {
    label: "One-stop product shop",
    localProducts: { tone: "muted", text: "Limited range" },
    localGarden: { tone: "good", text: "Products + support" },
    others: { tone: "muted", text: "Not always specialized" },
  },
];

const statusIcons = {
  good: "✓",
  muted: "×",
  neutral: "~",
};

function ComparisonCell({ tone, text, highlight = false }) {
  return (
    <div
      className={`${styles.cell} ${styles[tone]} ${
        highlight ? styles.highlightCell : ""
      }`}
    >
      <span className={styles.cellIcon} aria-hidden="true">
        {statusIcons[tone] ?? "~"}
      </span>

      <span className={styles.cellText}>{text}</span>
    </div>
  );
}

export default function ProductComparisonSection({ product }) {
  const title = product.comparisonTitle ?? "Local Garden vs the Rest";

  const subtitle =
    product.comparisonSubtitle ??
    `A product-focused comparison for ${product.title} that keeps the focus on better quality, better value, and a simpler buying experience.`;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.kicker}>
            <span className={styles.kickerDot} aria-hidden="true" />
            Product comparison
          </div>

          <h2 className={styles.title}>{title}</h2>

          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <div className={styles.tableShell}>
          <div className={styles.tableHeader}>
            <div className={styles.cornerCell}>
              <span>For better products</span>
            </div>

            <div className={styles.columnHeader}>
              Local Products
            </div>

            <div
              className={`${styles.columnHeader} ${styles.localGardenHeader}`}
            >
              Local Garden
            </div>

            <div className={styles.columnHeader}>
              Others
            </div>
          </div>

          <div className={styles.tableBody}>
            {comparisonRows.map((row) => (
              <div key={row.label} className={styles.row}>
                <div className={styles.rowLabel}>{row.label}</div>

                <ComparisonCell
                  tone={row.localProducts.tone}
                  text={row.localProducts.text}
                />

                <ComparisonCell
                  tone={row.localGarden.tone}
                  text={row.localGarden.text}
                  highlight
                />

                <ComparisonCell
                  tone={row.others.tone}
                  text={row.others.text}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}