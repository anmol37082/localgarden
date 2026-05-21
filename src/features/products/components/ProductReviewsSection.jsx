'use client';

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

export default function ProductReviewsSection({ product }) {
  const averageRating = Number(product.rating) || 4.9;
  const totalReviews = product.reviews || 0;
  const productName = product.title.toLowerCase();
  const reviewThumbs = product.images?.slice(0, 2) ?? [];

  const reviews = [
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

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, index) => (
      <span key={`${rating}-${index}`} className={index < rating ? styles.starActive : styles.starInactive}>
        ★
      </span>
    ));

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
              <div className={styles.summaryStars} aria-hidden="true">
                {renderStars(Math.round(averageRating))}
              </div>
            </div>
            <div className={styles.summaryNote}>Average rating on this year</div>
            <a href="#review-form" className={styles.reviewLink}>
              Write a review <span>→</span>
            </a>
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
          {reviews.map((review) => (
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
                    <div className={styles.reviewStars} aria-hidden="true">
                      {renderStars(review.rating)}
                    </div>
                    <div className={styles.reviewDate}>{review.date}</div>
                  </div>
                </div>

                <p className={styles.reviewText}>{review.text}</p>
              </div>

              {review.images.length ? (
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
    </section>
  );
}
