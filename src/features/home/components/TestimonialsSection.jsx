'use client';
/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
import styles from "./testimonials-section.module.css";

const testimonials = [
  {
    type: "quote",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
    quote:
      "The platform cut our analysis time dramatically. We moved from slow manual review to fast, consistent results across every sample.",
    name: "Ethan Rao",
    role: "Climate Research Institute",
  },
  {
    type: "quote",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
    name: "Lina Duarte",
    role: "Environmental Biologist",
    quote:
      "What impressed me most was the clarity of the insights. It made field decisions faster and gave our team more confidence in the data.",
  },
  {
    type: "quote",
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80",
    quote:
      "Our restoration team depends on this system to catch early signs of ecosystem stress. The alerts helped us act before small issues became major damage.",
    name: "Maria Solberg",
    role: "Conservation Project Lead",
  },
  {
    type: "quote",
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80",
    quote:
      "Seeing moss data next to pollution patterns changed how we plan monitoring. It turned scattered observations into a clear field strategy.",
    name: "Johan Mehra",
    role: "Forest Health Officer",
  },
  {
    type: "quote",
    image:
      "https://images.unsplash.com/photo-1473091534298-04dcbce3278c?auto=format&fit=crop&w=1200&q=80",
    avatar:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=240&q=80",
    quote:
      "The reporting workflow is simple, the outputs are clear, and our team can move from sampling to action without extra back-and-forth.",
    name: "Ava Fernandez",
    role: "Field Ecology Lead",
  },
  {
    type: "quote",
    image:
      "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&w=1200&q=80",
    avatar:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=240&q=80",
    quote:
      "We finally have a reliable way to compare sites across seasons, which makes long-term monitoring much more useful for the whole team.",
    name: "Noah Bennett",
    role: "Ecosystem Analyst",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className={styles.testimonialsSection}>
      <div className="container">
        <div className={styles.testimonialsHeader}>
          <div className={styles.testimonialsKicker}>[TESTIMONIALS]</div>
          <h2 className={styles.testimonialsTitle}>
            <span className={styles.testimonialsTitleLine}>Trusted by</span>
            <span>Researchers and Environmental Teams</span>
          </h2>
        </div>

        <div className={styles.testimonialsTrack}>
          {testimonials.map((item, index) => {
            return (
              <motion.article
                key={item.name}
                className={styles.testimonialCard}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
              >
                <img className={styles.testimonialCardImage} src={item.image} alt="" />
                <div className={styles.testimonialCardOverlay}>
                  <img className={styles.testimonialAvatar} src={item.avatar} alt="" />
                  <div className={styles.testimonialCardText}>
                    <p className={styles.testimonialQuote}>&quot;{item.quote}&quot;</p>
                    <div className={styles.testimonialMeta}>
                      <div className={styles.testimonialName}>{item.name}</div>
                      <div className={styles.testimonialRole}>{item.role}</div>
                    </div>
                  </div>
                  <div className={styles.testimonialHoverLayer}>
                    <div className={styles.testimonialHoverName}>{item.name}</div>
                    <div className={styles.testimonialHoverRole}>{item.role}</div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
