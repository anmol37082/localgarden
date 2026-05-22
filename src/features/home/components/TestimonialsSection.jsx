'use client';
/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
import styles from "./testimonials-section.module.css";

const testimonials = [
  {
    type: "quote",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80",
    avatar: "/testimonilas/profiles/riyasharma.webp",
    quote:
      "I started using the Fruit & Flower Booster for my rose and hibiscus plants, and within a few weeks, I could clearly see more buds and flowers. Earlier, my plants used to bloom very less, but now the flowering has increased so much, and the plants look healthier and fresher than before. Really happy with the results.",
    name: "Riya Sharma",
    role: "Verified buyer",
  },
  {
    type: "quote",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    avatar: "/testimonilas/profiles/amanverma.webp",
    name: "Aman Verma",
    role: "Verified buyer",
    quote:
      "The Plant Growth Enhancer worked amazingly for my indoor plants. I use it every 10–12 days, and the growth difference is clearly visible. The leaves became greener, the roots looked stronger, and even my small plants started growing faster naturally.",
  },
  {
    type: "quote",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
    avatar: "/testimonilas/profiles/nehakapoor.webp",
    quote:
      "My money plant and peace lily were turning yellow and looking dull. After using BIO-NPK Granules, the soil quality improved, and the leaves started becoming healthy again. I also noticed less leaf curling and overall better plant health. Very easy product for daily plant care.",
    name: "Neha Kapoor",
    role: "Verified buyer",
  },
  {
    type: "quote",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=80",
    avatar: "/testimonilas/profiles/rajeevmalhotra.webp",
    quote:
      "I used all three Local Garden products together for my terrace garden, and the results were honestly impressive. The Plant Growth Enhancer improved growth, the Flower Booster increased flowering, and the BIO-NPK Granules made the soil healthier. My entire garden looks greener and fuller now.",
    name: "Rajeev Malhotra",
    role: "Verified buyer",
  },
  {
    type: "quote",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80",
    avatar: "/testimonilas/profiles/simrankour.webp",
    quote:
      "What I liked most about Local Garden products is that they are very simple to use and give visible results naturally. My flowering plants are blooming more beautifully now, and even my indoor plants look fresh and healthy every day.",
    name: "Simran Kaur",
    role: "Verified buyer",
  },
  {
    type: "quote",
    image: "https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=1200&q=80",
    avatar: "/testimonilas/profiles/poojaarora.webp",
    quote:
      "I added BIO-NPK Granules to my indoor plants because the soil had become hard and unhealthy. After regular use, the soil became softer, plants looked more active, and the yellow leaves problem was reduced a lot. It really helped improve the overall health of my plants.",
    name: "Pooja Arora",
    role: "Verified buyer",
  },
  {
    type: "quote",
    image: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&w=1200&q=80",
    avatar: "/testimonilas/profiles/karanmehta.webp",
    quote:
      "I have many plants at home, and maintaining them is becoming difficult. After using the Plant Growth Enhancer, I noticed faster growth, healthier leaves, and stronger stems. The best part is that the product is easy to mix, and plants respond very quickly to it.",
    name: "Karan Mehta",
    role: "Verified buyer",
  },
  {
    type: "quote",
    image: "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1200&q=80",
    avatar: "/testimonilas/profiles/mehakjain.webp",
    quote:
      "The Fruit & Flower Booster gave amazing results for my flowering plants. My hibiscus and jasmine plants now produce more buds and flowers regularly. The leaves also look greener and healthier after using it continuously.",
    name: "Mehak Jain",
    role: "Verified buyer",
  },
  {
    type: "quote",
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80",
    avatar: "/testimonilas/profiles/arjunsingh.webp",
    quote:
      "I have tried many gardening products before, but Local Garden products actually gave visible and natural-looking results. My garden now looks healthier, greener, and more lively. Even visitors at my home ask me what I use for my plants.",
    name: "Arjun Singh",
    role: "Verified buyer",
  },
  {
    type: "quote",
    image: "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&w=1200&q=80",
    avatar: "/testimonilas/profiles/sakshigupta.webp",
    quote:
      "All three products together provide complete care for plants. The growth is better, the soil looks healthier, flowering has increased, and even weak plants have started recovering. These products made gardening much easier and more enjoyable for me.",
    name: "Sakshi Gupta",
    role: "Verified buyer",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className={styles.testimonialsSection}>
      <div className="container">
        <div className={styles.testimonialsHeader}>
          <div className={styles.testimonialsKicker}>[TESTIMONIALS]</div>
          <h2 className={styles.testimonialsTitle}>
            <span className={styles.testimonialsTitleLine}>See Why</span>
            <span> Plant Lovers Trust Local Garden </span>
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
