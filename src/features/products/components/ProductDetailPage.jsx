'use client';

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { addCartItem, dispatchCartUpdated } from "../../cart/cart-storage";
import ProductBannerSection from "./ProductBannerSection";
import ProductLoveSection from "./ProductLoveSection";
import ProductRelatedSection from "./ProductRelatedSection";
import ProductReviewsSection from "./ProductReviewsSection";
import styles from "./product-detail-page.module.css";

function StarRating({ rating, reviews }) {
  return (
    <div className={styles.ratingRow} aria-label={`${rating} out of 5 stars from ${reviews} reviews`}>
      <div className={styles.stars} aria-hidden="true">
        {"★★★★★".split("").map((star, index) => (
          <span key={`${star}-${index}`}>★</span>
        ))}
      </div>
      <span className={styles.ratingValue}>{rating}</span>
      <span className={styles.ratingReviews}>{reviews} reviews</span>
    </div>
  );
}

export default function ProductDetailPage({ product, productSlug }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openPanel, setOpenPanel] = useState("details");

  const activeImage = product.images[activeImageIndex] ?? product.images[0];

  const confidenceTitle = product.confidenceTitle ?? "Buy with confidence";
  const confidenceItems = useMemo(
    () =>
      product.confidenceItems ?? [
        "2X Faster Growth",
        "Liquid Bio-Fertiliser",
        "Disease Resistance",
        "Soil Improvement",
      ],
    [product.confidenceItems],
  );

  const moveImage = (direction) => {
    setActiveImageIndex((current) => {
      const next = current + direction;
      if (next < 0) return product.images.length - 1;
      if (next >= product.images.length) return 0;
      return next;
    });
  };

  const handleAddToCart = () => {
    addCartItem(
      {
        ...product,
        slug: productSlug,
      },
      {
        quantity,
        color: product.colors?.[0],
        image: activeImage,
      },
    );

    dispatchCartUpdated({ openCart: true });
  };

  const panels = [
    {
      id: "details",
      title: "Details",
      content: product.details,
    },
    {
      id: "dimension",
      title: "Dimension",
      content: product.dimensions,
    },
    {
      id: "shipping",
      title: "Shipping & Returns",
      content: product.shipping,
    },
  ];

  return (
    <section className={styles.pageShell}>
      <div className={styles.pageGlow} aria-hidden="true" />
      <div className="container">
        <div className={styles.breadcrumbs}>
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span>/</span>
          <Link href="#products" className={styles.breadcrumbLink}>
            Products
          </Link>
          <span>/</span>
          <span className={styles.breadcrumbCurrent}>{product.title}</span>
        </div>

        <div className={styles.heroGrid}>
          <div className={styles.galleryPanel}>
            <div className={styles.thumbnailRail}>
              {product.images.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  className={`${styles.thumbnailButton} ${
                    index === activeImageIndex ? styles.thumbnailButtonActive : ""
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`View image ${index + 1} of ${product.title}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="96px"
                    className={styles.thumbnailImage}
                  />
                </button>
              ))}
            </div>

            <div className={styles.mainImageWrap}>
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                priority
                sizes="(max-width: 991px) 100vw, 60vw"
                className={styles.mainImage}
              />

              <button
                type="button"
                className={`${styles.imageNav} ${styles.imageNavLeft}`}
                onClick={() => moveImage(-1)}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                className={`${styles.imageNav} ${styles.imageNavRight}`}
                onClick={() => moveImage(1)}
                aria-label="Next image"
              >
                ›
              </button>
            </div>
          </div>

          <div className={styles.infoPanel}>
            <div className={styles.productKicker}>{product.kicker}</div>
            <StarRating rating={product.rating} reviews={product.reviews} />
            <h1 className={styles.productTitle}>{product.title}</h1>
            <p className={styles.productSummary}>{product.summary}</p>

            <div className={styles.priceRow}>
              <div className={styles.currentPrice}>{product.price}</div>
              <div className={styles.oldPrice}>{product.compareAt}</div>
              <div className={styles.discount}>{product.discount}</div>
            </div>

            <div className={styles.purchaseRow}>
              <div className={styles.quantityControl} aria-label="Quantity selector">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                  -
                </button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((value) => value + 1)}>
                  +
                </button>
              </div>

              <button type="button" className={styles.addToCartButton} onClick={handleAddToCart}>
                Add to cart
              </button>
            </div>

            <div className={styles.confidenceCard}>
              <div className={styles.confidenceTitle}>{confidenceTitle}</div>
              <div className={styles.confidenceGrid}>
                {confidenceItems.map((item) => (
                  <div key={item} className={styles.confidenceItem}>
                    <span className={styles.confidenceIcon}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.accordion}>
              {panels.map((panel) => {
                const isOpen = openPanel === panel.id;
                return (
                  <div key={panel.id} className={styles.accordionItem}>
                    <button
                      type="button"
                      className={styles.accordionHeader}
                      onClick={() => setOpenPanel(isOpen ? "" : panel.id)}
                      aria-expanded={isOpen}
                    >
                      <span>{panel.title}</span>
                      <span>{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen ? <p className={styles.accordionContent}>{panel.content}</p> : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <ProductLoveSection product={product} />
      </div>

      <ProductBannerSection product={product} />
      <ProductReviewsSection product={product} />
      <ProductRelatedSection product={product} />
    </section>
  );
}
