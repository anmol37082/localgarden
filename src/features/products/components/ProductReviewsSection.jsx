'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./product-reviews-section.module.css";

const ratingRows = [
  { stars: 5, value: 0.72 },
  { stars: 4, value: 0.18 },
  { stars: 3, value: 0.07 },
  { stars: 2, value: 0.02 },
  { stars: 1, value: 0.01 },
];

const avatarPool = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80",
];

function Stars({ rating, className }) {
  return (
    <span className={className} aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={`${rating}-${index}`} className={index < rating ? styles.starActive : styles.starInactive}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ProductReviewsSection({ product }) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "5",
    review: "",
  });

  const averageRating = Number(product.rating) || 4.9;
  const totalReviews = product.reviews || 0;
  const productName = product.title.toLowerCase();
  const reviewThumbs = product.images?.slice(0, 2) ?? [];
  const productReviews = product.reviewItems ?? [
    {
      name: "Micheal Jonson",
      location: "Costa Mesa, California",
      date: "July 23, 2020",
      rating: 4,
      text: `We added ${product.title} to our routine and the results were immediate. The quality feels premium and the use case is straightforward.`,
      avatar: avatarPool[0],
      images: reviewThumbs,
    },
    {
      name: "Dianne Russell",
      location: "Costa Mesa, California",
      date: "July 23, 2020",
      rating: 5,
      text: `The ${productName} is simple to use and fits naturally into our workflow. It looks clean, performs well, and feels like a dependable buy.`,
      avatar: avatarPool[1],
      images: [],
    },
    {
      name: "Jerome Bell",
      location: "Costa Mesa, California",
      date: "July 23, 2020",
      rating: 4,
      text: `Solid finish, easy handling, and a polished result overall. It is the kind of product you end up recommending after the first week.`,
      avatar: avatarPool[2],
      images: reviewThumbs.slice(1),
    },
  ];

  useEffect(() => {
    if (!reviewOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setReviewOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [reviewOpen]);

  const openReviewForm = () => {
    setFormData({
      name: "",
      email: "",
      rating: "5",
      review: "",
    });
    setSubmitted(false);
    setReviewOpen(true);
  };

  const closeReviewForm = () => {
    setReviewOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.title}>Ratings &amp; Reviews</h2>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Total Reviews</div>
            <div className={styles.summaryValue}>{totalReviews}</div>
            <div className={styles.summaryNote}>Reviews on this product</div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Average Ratings</div>
            <div className={styles.summaryRatingRow}>
              <div className={styles.summaryValue}>{averageRating.toFixed(1)}</div>
              <Stars rating={Math.round(averageRating)} className={styles.summaryStars} />
            </div>
            <div className={styles.summaryNote}>Average rating on this year</div>
            <button type="button" className={styles.reviewLink} onClick={openReviewForm}>
              Write a review <span>→</span>
            </button>
          </div>

          <div className={styles.breakdownCard}>
            {ratingRows.map((row) => {
              const count = Math.max(1, Math.round(totalReviews * row.value));
              return (
                <div key={row.stars} className={styles.breakdownRow}>
                  <span className={styles.breakdownStars}>{row.stars}</span>
                  <div className={styles.breakdownBar}>
                    <span style={{ width: `${row.value * 100}%` }} />
                  </div>
                  <span className={styles.breakdownCount}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.reviewList}>
          {productReviews.map((review) => (
            <article key={review.name} className={styles.reviewItem}>
              <div className={styles.reviewAvatarWrap}>
                <Image
                  src={review.avatar}
                  alt={review.name}
                  fill
                  sizes="64px"
                  className={styles.reviewAvatar}
                />
              </div>

              <div className={styles.reviewBody}>
                <div className={styles.reviewTopRow}>
                  <div>
                    <div className={styles.reviewName}>{review.name}</div>
                    <div className={styles.reviewLocation}>{review.location}</div>
                  </div>
                  <div className={styles.reviewRatingBlock}>
                    <Stars rating={review.rating} className={styles.reviewStars} />
                    <div className={styles.reviewDate}>{review.date}</div>
                  </div>
                </div>

                <p className={styles.reviewText}>{review.text}</p>
              </div>

              {review.images?.length ? (
                <div className={styles.reviewThumbs}>
                  {review.images.map((image) => (
                    <div key={image.src} className={styles.reviewThumb}>
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="120px"
                        className={styles.reviewThumbImage}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>

      {reviewOpen ? (
        <div className={styles.modalBackdrop} role="presentation" onClick={closeReviewForm}>
          <div
            className={`${styles.modal} ${submitted ? styles.modalSuccess : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalClose}
              aria-label="Close review form"
              onClick={closeReviewForm}
            >
              ×
            </button>

            {!submitted ? (
              <form className={styles.modalBody} onSubmit={handleSubmit}>
                <div className={styles.modalHeader}>
                  <div className={styles.modalKicker}>Write a review</div>
                  <h3 id="review-modal-title" className={styles.modalTitle}>
                    Share your experience
                  </h3>
                  <p className={styles.modalText}>
                    Tell us what you liked, how it worked, and anything helpful for other shoppers.
                  </p>
                </div>

                <div className={styles.fieldGrid}>
                  <label className={styles.field}>
                    <span>Name</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <span>Email</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your email"
                      required
                    />
                  </label>
                </div>

                <div className={styles.field}>
                  <span>Rating</span>
                  <div className={styles.starPicker} role="radiogroup" aria-label="Rating">
                    {Array.from({ length: 5 }, (_, index) => {
                      const value = String(index + 1);
                      const isActive = index + 1 <= Number(formData.rating);

                      return (
                        <button
                          key={value}
                          type="button"
                          className={`${styles.starPickButton} ${isActive ? styles.starPickButtonActive : ""}`}
                          onClick={() => setFormData((current) => ({ ...current, rating: value }))}
                          aria-pressed={isActive}
                          aria-label={`${value} star${value === "1" ? "" : "s"}`}
                        >
                          ★
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className={styles.field}>
                  <span>Review</span>
                  <textarea
                    name="review"
                    value={formData.review}
                    onChange={handleInputChange}
                    placeholder="Write your review here"
                    rows={5}
                    required
                  />
                </label>

                <button type="submit" className={styles.submitButton}>
                  Submit review
                </button>
              </form>
            ) : (
              <div className={styles.thankYou}>
                <div className={styles.thankYouCelebration} aria-hidden="true">
                  <span className={styles.thankYouCheck}>✓</span>
                </div>
                <div className={styles.thankYouBadge}>Thanks</div>
                <h3 className={styles.thankYouTitle}>Thank you for your review.</h3>
                <p className={styles.thankYouText}>
                  Your review has been submitted successfully. It helps other shoppers make a confident choice, and
                  we truly appreciate the time you took to share it.
                </p>
                <button type="button" className={styles.submitButton} onClick={closeReviewForm}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
