"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Brand, Icon, Ribbon } from "./Icons";
import { content, copy, serviceHref, ui } from "../lib/content";
gsap.registerPlugin(ScrollTrigger);

export function Button({
  children,
  href = "/#contact",
  outline = false,
  className = "",
  ...props
}) {
  return (
    <a
      href={href}
      className={`dn-btn ${outline ? "dn-btn-outline" : ""} ${className}`}
      {...props}
    >
      {children}
      <Icon />
    </a>
  );
}
export function Chips({ items }) {
  return (
    <div className="dn-chips">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}
export function SectionHeading({ data, center = false }) {
  return (
    <div className={`dn-section-heading dn-fade ${center ? "dn-center" : ""}`}>
      <span className="dn-eyebrow">
        <i />
        {data[0]}
      </span>
      <h2>{data[1]}</h2>
      {data[2] && <p>{data[2]}</p>}
    </div>
  );
}
export function RevealText({ text, className = "" }) {
  return (
    <p className={`dn-reveal ${className}`}>
      {text.split(" ").map((word, i) => (
        <span key={i}>{word} </span>
      ))}
    </p>
  );
}
export function Header() {
  const [theme, setTheme] = useState("dark");
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dialog = useRef(null);
  const menuButton = useRef(null);
  const pathname = usePathname();
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || "dark");
  }, []);
  useEffect(() => {
    if (!open) return;
    const d = dialog.current;
    d.showModal();
    document.body.style.overflow = "hidden";
    window.dnLenis?.stop();
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        d,
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" },
      );
      gsap.fromTo(
        d.querySelectorAll(".dn-menu-item"),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.055, duration: 0.4 },
      );
    }
    return () => {
      gsap.killTweensOf(d);
      d.close();
      document.body.style.overflow = "";
      window.dnLenis?.start();
      menuButton.current?.focus();
    };
  }, [open]);
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    document.documentElement.setAttribute("color-scheme", next);
    try {
      localStorage.setItem("dn-theme", next);
    } catch {}
  };
  const close = () => setOpen(false);
  return (
    <>
      <a className="dn-skip" href="#main">
        {ui.skip}
      </a>
      <header className="dn-header">
        <a
          href="/"
          className="dn-home"
          aria-label={content.company.name + " " + ui.home}
        >
          <Brand />
        </a>
        <div className="dn-header-actions">
          <button
            className="dn-round dn-theme"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} />
          </button>
          <Button href={pathname === "/" ? "#contact" : "/#contact"} outline>
            {copy.labels.quote}
          </Button>
          <button
            ref={menuButton}
            className="dn-round dn-menu-trigger"
            onClick={() => setOpen(true)}
            aria-label={copy.labels.menu}
            aria-expanded={open}
            aria-controls="dn-menu"
          >
            <Icon name="menu" />
          </button>
        </div>
      </header>
      <dialog
        ref={dialog}
        id="dn-menu"
        className="dn-menu"
        onCancel={close}
        aria-label={ui.mainNav}
      >
        <div className="dn-menu-top">
          <span>
            <Icon name="spark" />
            {content.company.signoff}
          </span>
          <button
            className="dn-round"
            onClick={close}
            aria-label={ui.closeMenu}
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="dn-menu-body">
          <nav aria-label={ui.nav}>
            <div className="dn-menu-item">
              <button
                className="dn-menu-link"
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen(!servicesOpen)}
              >
                {copy.nav[0][0]}
                <Icon name={servicesOpen ? "close" : "plus"} />
              </button>
              {servicesOpen && (
                <div className="dn-submenu">
                  {copy.menuGroups.map((group) => (
                    <div key={group.name}>
                      <h3>{group.name}</h3>
                      {group.ids.map((id) => {
                        const s = content.services[id - 1];
                        const href = serviceHref(s);
                        return href ? (
                          <a key={id} href={href} onClick={close}>
                            {s.name}
                            <Icon />
                          </a>
                        ) : (
                          <span key={id}>
                            {s.name} ({s.badge})
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {copy.nav.slice(1).map(([label, id]) => (
              <a
                className="dn-menu-item dn-menu-link"
                onClick={close}
                href={id === "founder" ? "/founder/" : `/#${id}`}
                key={id}
              >
                {label}
                <Icon />
              </a>
            ))}
          </nav>
          <div className="dn-menu-promo">
            <p>{copy.cta.title}</p>
            <div>
              <Ribbon />
            </div>
          </div>
        </div>
        <div className="dn-menu-bottom">
          <span>{ui.menuCompany}</span>
          <span>{ui.year}</span>
        </div>
      </dialog>
      <div className="dn-progress" aria-hidden="true" />
      <button
        className="dn-round dn-to-top"
        onClick={() =>
          window.dnLenis
            ? window.dnLenis.scrollTo(0)
            : window.scrollTo({
                top: 0,
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "instant"
                  : "smooth",
              })
        }
        aria-label={copy.misc.top}
      >
        <Icon name="down" />
      </button>
    </>
  );
}

export function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    const mm = gsap.matchMedia();
    const progress = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      document
        .querySelector(".dn-progress")
        ?.style.setProperty(
          "transform",
          `scaleY(${max > 0 ? scrollY / max : 0})`,
        );
      document.body.classList.toggle("dn-scrolled", scrollY > 120);
    };
    addEventListener("scroll", progress, { passive: true });
    progress();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({
        duration: 1.1,
        smoothWheel: true,
        anchors: true,
      });
      window.dnLenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      const entrance = gsap.from(".dn-hero-line", {
        y: 65,
        opacity: 0,
        duration: 1.1,
        stagger: 0.13,
        ease: "power4.out",
        paused: document.documentElement.hasAttribute("data-dn-loading"),
      });
      const revealHero = () => entrance.play();
      window.addEventListener("dn:loaded", revealHero, { once: true });
      const ticker = document.querySelector(".dn-ticker-track");
      if (ticker) {
        const loop = gsap.timeline({ repeat: -1 });
        for (let step = 1; step <= 5; step++)
          loop.to(
            ticker,
            { yPercent: -step * 2, duration: 0.55, ease: "power3.inOut" },
            step * 1.2 - 0.55,
          );
      }
      // Observe entrances without measuring every below-the-fold card on startup.
      const fadeElements = gsap.utils.toArray(".dn-fade");
      const fadeTweens = [];
      fadeElements.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(42px)";
      });
      const fadeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            fadeTweens.push(
              gsap.to(entry.target, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out",
                clearProps: "transform,opacity",
              }),
            );
            fadeObserver.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px 4% 0px" },
      );
      fadeElements.forEach((el) => fadeObserver.observe(el));
      gsap.utils.toArray(".dn-reveal").forEach((el) =>
        gsap.fromTo(
          el.children,
          { "--dn-word-progress": 0 },
          {
            "--dn-word-progress": 1,
            stagger: 0.08,
            scrollTrigger: {
              trigger: el,
              start: "top 94%",
              end: "bottom 65%",
              scrub: true,
            },
          },
        ),
      );
      gsap.utils.toArray(".dn-float").forEach((el, i) =>
        gsap.to(el, {
          y: 15,
          duration: 3 + i * 0.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }),
      );
      const parallax = gsap.utils.toArray(".dn-parallax");
      const move = (e) => {
        gsap.to(parallax, {
          x: (e.clientX / innerWidth - 0.5) * 22,
          y: (e.clientY / innerHeight - 0.5) * 22,
          duration: 1,
          overwrite: "auto",
        });
      };
      if (matchMedia("(pointer: fine)").matches)
        addEventListener("pointermove", move);
      const cleanups = [];
      gsap.utils.toArray(".dn-marquee-track").forEach((el) => {
        const tween = gsap.to(el, {
          xPercent: -50,
          duration: el.closest(".dn-tools-strip") ? 45 : 30,
          ease: "none",
          repeat: -1,
        });
        const pause = () => tween.pause(),
          play = () => tween.resume();
        el.parentElement.addEventListener("mouseenter", pause);
        el.parentElement.addEventListener("mouseleave", play);
        el.parentElement.addEventListener("focusin", pause);
        el.parentElement.addEventListener("focusout", play);
        cleanups.push(() => {
          el.parentElement.removeEventListener("mouseenter", pause);
          el.parentElement.removeEventListener("mouseleave", play);
          el.parentElement.removeEventListener("focusin", pause);
          el.parentElement.removeEventListener("focusout", play);
        });
      });
      gsap.utils.toArray("[data-count]").forEach((el) => {
        const value = Number(el.dataset.count),
          counter = { value: 0 };
        gsap.to(counter, {
          value,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(counter.value);
          },
        });
      });
      // The footer signature writes itself in once, left to right, when seen.
      const signature = document.querySelector(".dn-credit img");
      let signTween;
      const signObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          signObserver.disconnect();
          signTween = gsap.to(signature, {
            clipPath: "inset(-20% -10% -20% 0%)",
            duration: 1.4,
            ease: "power2.inOut",
            clearProps: "clipPath",
          });
        },
        { threshold: 0.6 },
      );
      if (signature) {
        signature.style.clipPath = "inset(-20% 100% -20% 0%)";
        // Watch the row, not the clipped image, which has no visible area.
        signObserver.observe(signature.closest(".dn-credit"));
      }
      const refresh = () => ScrollTrigger.refresh();
      document.fonts.ready.then(refresh);
      const timer = setTimeout(refresh, 600);
      return () => {
        window.removeEventListener("dn:loaded", revealHero);
        clearTimeout(timer);
        fadeObserver.disconnect();
        fadeTweens.forEach((tween) => tween.kill());
        signObserver.disconnect();
        signTween?.kill();
        signature?.style.removeProperty("clip-path");
        fadeElements.forEach((el) => {
          el.style.removeProperty("opacity");
          el.style.removeProperty("transform");
        });
        removeEventListener("pointermove", move);
        cleanups.forEach((fn) => fn());
        gsap.ticker.remove(tick);
        lenis.destroy();
        delete window.dnLenis;
      };
    });
    return () => {
      mm.revert();
      removeEventListener("scroll", progress);
      document.body.classList.remove("dn-scrolled");
    };
  }, [pathname]);
  return null;
}

export function Footer() {
  return (
    <footer className="dn-footer">
      <div className="dn-footer-grid dn-container">
        <div className="dn-footer-brand">
          <a href="/" aria-label={content.company.name + " " + ui.home}>
            <Brand />
          </a>
          <p>{content.company.tagline}</p>
          <div className="dn-actions">
            <Button>{copy.labels.quote}</Button>
            <Button
              href={content.company.whatsapp}
              outline
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.labels.whatsapp}
            </Button>
          </div>
        </div>
        <div>
          <h3>{copy.misc.tech}</h3>
          {content.services.slice(0, 7).map((s) => (
            <a key={s.id} href={serviceHref(s)}>
              {s.name}
            </a>
          ))}
        </div>
        <div>
          <h3>{copy.misc.creative}</h3>
          {content.services
            .filter((s) => s.id >= 8 && s.id !== 9)
            .map((s) =>
              serviceHref(s) ? (
                <a key={s.id} href={serviceHref(s)}>
                  {s.name}
                </a>
              ) : (
                <span key={s.id}>
                  {s.name} ({s.badge})
                </span>
              ),
            )}
        </div>
        <div>
          <h3>{copy.misc.company}</h3>
          {copy.nav.slice(1).map(([name, id]) => (
            <a href={id === "founder" ? "/founder/" : `/#${id}`} key={id}>
              {name}
            </a>
          ))}
        </div>
        <div>
          <h3>{copy.misc.contact}</h3>
          <a href={content.company.tel}>{content.company.phone}</a>
          <a href={`mailto:${content.company.email}`}>
            {content.company.email}
          </a>
          <p>{content.company.location}</p>
        </div>
      </div>
      <div className="dn-footer-legal dn-container">
        <span>{content.company.copyright}</span>
        <div className="dn-credit">
          <a
            className="dn-credit-sign"
            href={content.credit.whatsapp}
            target="_blank"
            rel="noopener"
            title={`Chat with ${content.credit.name} on WhatsApp`}
          >
            <span>{content.credit.label}</span>
            <img
              src="/img/signature-3d.webp"
              width="900"
              height="459"
              alt={content.credit.name}
              loading="lazy"
            />
            <span className="dn-sr-only">
              {" "}
              (chat on WhatsApp, opens in a new tab)
            </span>
          </a>
          <a
            className="dn-credit-icon"
            href={content.credit.whatsapp}
            target="_blank"
            rel="noopener"
            aria-label={`Chat with ${content.credit.name} on WhatsApp (opens in a new tab)`}
            title="WhatsApp"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.04 2A9.9 9.9 0 0 0 3.5 16.9L2 22l5.25-1.38A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 1 1 6.97 3.86Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.22-.08-.39-.12-.55.13-.16.24-.63.8-.78.96-.14.17-.29.19-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.66.31c-.22.25-.86.85-.86 2.07 0 1.21.88 2.39 1 2.55.13.17 1.74 2.66 4.22 3.73.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.46-.6 1.67-1.18.2-.58.2-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
            </svg>
          </a>
          <a
            className="dn-credit-icon"
            href={content.credit.github}
            target="_blank"
            rel="noopener"
            aria-label={`${content.credit.name} on GitHub (opens in a new tab)`}
            title="GitHub"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
            </svg>
          </a>
        </div>
        <span>{content.company.signoff}</span>
      </div>
      <div className="dn-footer-word" aria-hidden="true">
        DEVNANDAN
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html:
            "<!-- TODO(owner): Add confirmed social links and the original devnandan-logo.jpg source asset when supplied. -->",
        }}
      />
    </footer>
  );
}
