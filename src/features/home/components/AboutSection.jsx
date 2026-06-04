'use client';

import styles from "./about-section.module.css";

export default function AboutSection() {
  return (
    <section className={styles.aboutSection} id="about">
      <div className="container">
        <div className={styles.aboutTop}>
          <div className={styles.sectionKicker}>[ABOUT US]</div>
          <p className={styles.aboutLead}>
          Local Garden by Akshay Organics was started in 2017 with one goal, to make plant care easy and bring more greenery into everyday life. From beautiful landscaping, vertical gardens, and rooftop gardens to organic plant care products, we help plants grow healthier, stronger, and happier naturally.
Because every plant deserves the right care to bloom beautifully.
          </p>
        </div>
      </div>
    </section>
  );
}
