'use client';
/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./product-videos-section.module.css";

const productVideos = [
  {
    title: "LG PV 19-5 2",
    description: "Product video showcase.",
    video: "https://res.cloudinary.com/dpfxbkaem/video/upload/v1780578255/LG_PV_19-5_2__1_ixwqnu.mp4",
  },
  {
    title: "LG 21-05-26 03",
    description: "Product video showcase.",
    video: "https://res.cloudinary.com/dpfxbkaem/video/upload/v1780578262/LG_21-05-26_03__1_yb8jzn.mp4",
  },
  {
    title: "LG PV 19-5 1",
    description: "Product video showcase.",
    video: "https://res.cloudinary.com/dpfxbkaem/video/upload/v1780578261/LG_PV_19-5_1_ieeiig.mp4",
  },
  {
    title: "LG PV 18-5 2",
    description: "Product video showcase.",
    video: "https://res.cloudinary.com/dpfxbkaem/video/upload/v1780578271/LG_PV_18-5_2__1_ltxxnj.mp4",
  },
  {
    title: "LG PV 18-5 1",
    description: "Product video showcase.",
    video: "https://res.cloudinary.com/dpfxbkaem/video/upload/v1780578275/LG_PV_18-5_1_c2o5tf.mp4",
  },
  {
    title: "LG UGC 20-5 1",
    description: "Product video showcase.",
    video: "https://res.cloudinary.com/dpfxbkaem/video/upload/v1780578277/LG_UGC_20-5_1_twevbe.mp4",
  },
  {
    title: "LG 3-6 2",
    description: "Product video showcase.",
    video: "https://res.cloudinary.com/dpfxbkaem/video/upload/v1780578284/LG_3-6_2__1_vis3jt.mp4",
  },
  {
    title: "LG 21-05-26 02",
    description: "Product video showcase.",
    video: "https://res.cloudinary.com/dpfxbkaem/video/upload/v1780578292/LG_21-05-26_02__1_vaq6lf.mp4",
  },
  {
    title: "LG 3-6 1",
    description: "Product video showcase.",
    video: "https://res.cloudinary.com/dpfxbkaem/video/upload/v1780578292/LG_3-6_1_mz9616.mp4",
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
          <div className={styles.videoKicker}>[ARE VIDEOS]</div>
          <h2 className={styles.videoTitle}>Press Play on Real Experiences</h2>
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
