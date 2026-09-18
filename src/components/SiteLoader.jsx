"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./site-loader.module.css";

export default function SiteLoader() {
  const [leaving, setLeaving] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const finishLoading = () => setLeaving(true);
    window.addEventListener("load", finishLoading, { once: true });
    if (document.readyState === "complete") queueMicrotask(finishLoading);
    return () => window.removeEventListener("load", finishLoading);
  }, []);

  useEffect(() => {
    if (!leaving) return undefined;
    const timer = window.setTimeout(() => setVisible(false), 420);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  if (!visible) return null;

  return (
    <div className={`${styles.loader} ${leaving ? styles.leaving : ""}`} role="status" aria-label="Loading Local Garden">
      <div className={styles.logoWrap}>
        <span className={styles.glow} />
        <Image src="/loader.svg" alt="Loading" fill sizes="128px" className={styles.logo} />
      </div>
      <div className={styles.bar} />
      <p>Growing something beautiful</p>
    </div>
  );
}