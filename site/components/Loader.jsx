"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ui } from "../lib/content";

export default function Loader() {
  const root = useRef(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (!html.hasAttribute("data-dn-loading") || reduced.matches) {
      html.removeAttribute("data-dn-loading");
      clearTimeout(window.dnLoadingTimeout);
      setDismissed(true);
      window.dispatchEvent(new Event("dn:loaded"));
      return;
    }

    let finished = false;
    const background = Array.from(
      document.querySelectorAll(
        ".dn-header, #main, .dn-footer, .dn-skip, .dn-to-top",
      ),
      (element) => ({ element, inert: element.inert }),
    );
    background.forEach(({ element }) => {
      element.inert = true;
    });

    const restore = () => {
      background.forEach(({ element, inert }) => {
        element.inert = inert;
      });
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(window.dnLoadingTimeout);
      html.removeAttribute("data-dn-loading");
      restore();
      setDismissed(true);
      window.dispatchEvent(new Event("dn:loaded"));
    };

    const q = (selector) => root.current.querySelector(selector);
    const all = (selector) => root.current.querySelectorAll(selector);
    const shell = q(".dn-loader-shell");
    const wave = q(".dn-loader-wave");
    const timeline = gsap.timeline({ paused: true, onComplete: finish });
    timeline
      // The two halves of the D arrive from opposite corners.
      .fromTo(
        shell,
        { opacity: 0, x: 90, y: -70, rotate: 14, filter: "blur(14px)" },
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotate: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "expo.out",
        },
        0.15,
      )
      .fromTo(
        wave,
        { opacity: 0, x: -90, y: 70, rotate: -14, filter: "blur(14px)" },
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotate: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "expo.out",
        },
        0.22,
      )
      // They lock together with a flash and a pulse ring.
      .fromTo(
        q(".dn-loader-flash"),
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 0.18, ease: "power2.out" },
        0.72,
      )
      .to(q(".dn-loader-flash"), { opacity: 0, scale: 1.4, duration: 0.7 }, 0.9)
      .fromTo(
        q(".dn-loader-ring"),
        { opacity: 0.9, scale: 0.55 },
        {
          opacity: 0,
          scale: 1.9,
          duration: 1,
          ease: "power2.out",
          immediateRender: false,
        },
        0.74,
      )
      .fromTo(
        q(".dn-loader-logo"),
        { scale: 1.06 },
        { scale: 1, duration: 0.6, ease: "back.out(2.4)" },
        0.74,
      )
      .fromTo(
        q(".dn-loader-halo"),
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        0.74,
      )
      // The wordmark rises letter by letter.
      .fromTo(
        all(".dn-loader-name span"),
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.035,
          ease: "power3.out",
        },
        0.9,
      )
      .fromTo(
        q(".dn-loader-tag"),
        { opacity: 0, letterSpacing: "0.1em" },
        { opacity: 1, letterSpacing: "0.42em", duration: 0.8, ease: "power2.out" },
        1.15,
      )
      // The curtain lifts to reveal the page.
      .to(
        q(".dn-loader-content"),
        { y: -40, opacity: 0, duration: 0.45, ease: "power2.in" },
        1.95,
      )
      .to(
        root.current,
        { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "expo.inOut" },
        2.1,
      );
    // Start once both halves have decoded, but never wait more than a moment.
    Promise.race([
      Promise.all(
        [shell, wave].map((img) => img.decode().catch(() => {})),
      ),
      new Promise((resolve) => setTimeout(resolve, 600)),
    ]).then(() => {
      if (!finished) timeline.play();
    });

    const cancel = () => {
      timeline.kill();
      finish();
    };
    const restoredPage = (event) => {
      if (event.persisted) cancel();
    };
    window.addEventListener("dn:loaded", cancel);
    window.addEventListener("pageshow", restoredPage);
    reduced.addEventListener("change", cancel);
    return () => {
      timeline.kill();
      restore();
      window.removeEventListener("dn:loaded", cancel);
      window.removeEventListener("pageshow", restoredPage);
      reduced.removeEventListener("change", cancel);
    };
  }, []);

  if (dismissed) return null;
  return (
    <div ref={root} className="dn-loader" role="status" aria-label={ui.loading}>
      <div className="dn-loader-content" aria-hidden="true">
        <div className="dn-loader-stage">
          <span className="dn-loader-halo" />
          <span className="dn-loader-ring" />
          <div className="dn-loader-logo">
            <img
              className="dn-loader-shell"
              src="/img/loader-d-shell.webp"
              width="1024"
              height="1024"
              alt=""
              fetchPriority="high"
            />
            <img
              className="dn-loader-wave"
              src="/img/loader-d-wave.webp"
              width="1024"
              height="1024"
              alt=""
              fetchPriority="high"
            />
          </div>
          <span className="dn-loader-flash" />
        </div>
        <div className="dn-loader-name">
          {"Devnandan".split("").map((letter, i) => (
            <span key={i}>{letter}</span>
          ))}
        </div>
        <span className="dn-loader-tag">IT SOLUTIONS</span>
      </div>
    </div>
  );
}
