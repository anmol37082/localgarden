'use client';
/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
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
    video: "https://res.cloudinary.com/dcgxoij6b/video/upload/q_auto,f_auto/productvideo1_qvtcng.mp4",
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
  const [expandedVideo, setExpandedVideo] = useState(null);

  const setVideoRef = (videoId) => (node) => {
    if (node) {
      videoRefs.current.set(videoId, node);
      return;
    }

    videoRefs.current.delete(videoId);
  };

  const pauseAllVideos = (exceptVideoId = null) => {
    videoRefs.current.forEach((video, videoId) => {
      if (videoId !== exceptVideoId && !video.paused) {
        video.pause();
      }
    });
  };

  const toggleVideoPlayback = async (videoId) => {
    const video = videoRefs.current.get(videoId);
    if (!video) return;

    if (video.paused) {
      pauseAllVideos(videoId);
      video.muted = false;
      try {
        await video.play();
      } catch {
        // Browser autoplay restrictions can still block playback if focus/gesture changes.
      }
      return;
    }

    video.pause();
  };

  const handleExpand = (item, videoId) => {
    const video = videoRefs.current.get(videoId);

    pauseAllVideos(videoId);

    if (video) {
      video.pause();
    }

    setExpandedVideo({ ...item, videoId });
  };

  const closeExpandedVideo = () => {
    pauseAllVideos();
    setExpandedVideo(null);
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
                <button
                  type="button"
                  className={styles.videoExpandButton}
                  onClick={() => handleExpand(item, videoId)}
                  aria-label={`Open ${item.title} in larger view`}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.iconSvg}>
                    <path
                      d="M7 3H3v4M17 3h4v4M7 21H3v-4M17 21h4v-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div className={styles.videoMediaWrap}>
                  <video
                    ref={setVideoRef(videoId)}
                    className={styles.videoHover}
                    loop
                    playsInline
                    preload="metadata"
                    onClick={() => toggleVideoPlayback(videoId)}
                  >
                    <source src={item.video} type="video/mp4" />
                  </video>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {expandedVideo && (
        <div className={styles.videoExpandedBackdrop} onClick={closeExpandedVideo} role="presentation">
          <div
            className={styles.videoExpandedFrame}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${expandedVideo.title} larger video`}
          >
            <button
              type="button"
              className={styles.videoExpandedClose}
              onClick={closeExpandedVideo}
              aria-label="Close larger video"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.iconSvg}>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <video
              className={styles.videoExpandedPlayer}
              autoPlay
              playsInline
              preload="metadata"
            >
              <source src={expandedVideo.video} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </section>
  );
}
