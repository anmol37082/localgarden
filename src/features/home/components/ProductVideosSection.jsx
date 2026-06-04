'use client';
/* eslint-disable @next/next/no-img-element */

import { useRef } from "react";
import { motion } from "framer-motion";
import styles from "./product-videos-section.module.css";

const productVideos = [
  {
    title: "Plant Growth Enhancer",
    description: "Stronger roots and greener growth in one quick care routine.",
    video: "/productvideo/productvideo01.mp4",
  },
  {
    title: "Flower & Fruit Booster",
    description: "Helps plants bloom better and support healthier fruiting.",
    video: "/productvideo/productvideo2.mp4",
  },
  {
    title: "Bio NPK Granules",
    description: "Dust-free granules for healthier soil and steady nourishment.",
    video: "/productvideo/productvideo3.mp4",
  },
  {
    title: "Plant Growth Enhancer",
    description: "Useful for plants that need a boost in daily care.",
    video: "/herovideo3.mp4",
  },
  {
    title: "Flower & Fruit Booster",
    description: "Balanced support for flowering plants and fruit plants.",
    video: "/herovideofinal.mp4",
  },
  {
    title: "Bio NPK Granules",
    description: "Supports healthier roots and better soil condition.",
    video: "/herovideo3.mp4",
  },
  {
    title: "Plant Growth Enhancer",
    description: "Everyday plant nutrition with an easy application flow.",
    video: "/herovideofinal.mp4",
  },
  {
    title: "Bio NPK Granules",
    description: "A clean organic option for healthier plant support.",
    video: "/herovideo3.mp4",
  },
];

export default function ProductVideosSection() {
  const scrollerRef = useRef(null);
  const videoRefs = useRef(new Map());

  const setVideoRef = (videoId) => (node) => {
    if (node) {
      videoRefs.current.set(videoId, node);
      return;
    }

    videoRefs.current.delete(videoId);
  };

  const handleVideoClick = async (videoId) => {
    const video = videoRefs.current.get(videoId);
    if (!video) return;

    video.muted = false;

    if (video.paused) {
      try {
        await video.play();
      } catch {
        // Browser autoplay restrictions can still block playback if focus/gesture changes.
      }
      return;
    }

    video.muted = false;
  };

  return (
    <section id="pricing" className={styles.videoSection}>
      <div className="container">
        <div className={styles.videoHeading}>
          <div className={styles.videoKicker}>[PRODUCT VIDEOS]</div>
          <h2 className={styles.videoTitle}>Plant Videos In Motion</h2>
        </div>

        <div className={styles.videoRail} ref={scrollerRef}>
          {productVideos.map((item, index) => {
            const videoId = `${item.title}-${index}`;

            return (
              <motion.article
                key={videoId}
                className={styles.videoCard}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
              >
                <div className={styles.videoMediaWrap}>
                  <video
                    ref={setVideoRef(videoId)}
                    className={styles.videoHover}
                    loop
                    playsInline
                    preload="metadata"
                    onClick={() => handleVideoClick(videoId)}
                    controls
                  >
                    <source src={item.video} type="video/mp4" />
                  </video>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
