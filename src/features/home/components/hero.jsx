'use client';

import { useEffect, useState } from "react";
import styles from "./hero.module.css";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 575.98px)");

    const updateIsMobile = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateIsMobile();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateIsMobile);
      return () => mediaQuery.removeEventListener("change", updateIsMobile);
    }

    mediaQuery.addListener(updateIsMobile);
    return () => mediaQuery.removeListener(updateIsMobile);
  }, []);

  const videoSrc = isMobile ? "/herovidbanmob1.mp4" : "/herobannervid1.mp4";

  return (
    <section className={styles.heroSection} id="home">
      <video
        key={videoSrc}
        className={styles.heroVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        src={videoSrc}
      >
        Your browser does not support the video tag.
      </video>
    </section>
  );
}
