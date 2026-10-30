"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Keyboard, A11y, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { content, copy, serviceHref, ui } from "../lib/content";
import { Icon } from "./Icons";
import Artwork from "./Artwork";
import { Button, Chips } from "./Shell";

gsap.registerPlugin(ScrollTrigger);
export function TierCards({ tiers, compact = false, highlight = true }) {
  return (
    <div className={`dn-tier-grid ${compact ? "dn-tier-compact" : ""}`}>
      {tiers.map((tier, i) => (
        <article
          key={tier.name}
          className={`dn-tier ${highlight && i === 0 ? "dn-tier-highlight" : ""}`}
        >
          <span className="dn-tier-index">/0{i + 1}</span>
          <h3>{tier.name}</h3>
          <p className="dn-price">{tier.note}</p>
          <ul>
            {(compact ? tier.bullets.slice(0, 4) : tier.bullets).map((b) => (
              <li key={b}>
                <Icon name="check" />
                {b}
              </li>
            ))}
          </ul>
          <Button href="/#contact" outline>
            {copy.misc.planCTA}
          </Button>
        </article>
      ))}
    </div>
  );
}
function TabBar({ items, active, onChange, prefix }) {
  const refs = useRef([]);
  return (
    <div
      className="dn-tabs"
      role="tablist"
      aria-label={prefix === "ai" ? ui.aiTabs : ui.serviceTabs}
    >
      {items.map((name, i) => (
        <button
          key={name}
          ref={(el) => (refs.current[i] = el)}
          id={`${prefix}-tab-${i}`}
          role="tab"
          type="button"
          tabIndex={active === i ? 0 : -1}
          aria-selected={active === i}
          aria-controls={`${prefix}-panel`}
          onClick={() => onChange(i)}
          onKeyDown={(e) => {
            if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
              e.preventDefault();
              const n =
                e.key === "Home"
                  ? 0
                  : e.key === "End"
                    ? items.length - 1
                    : (i + (e.key === "ArrowRight" ? 1 : items.length - 1)) %
                      items.length;
              onChange(n);
              refs.current[n]?.focus();
            }
          }}
        >
          {name}
          <Icon />
        </button>
      ))}
    </div>
  );
}
export function ServicePlans() {
  const [active, setActive] = useState(0);
  const services = content.services.slice(0, 7);
  const s = services[active];
  return (
    <>
      <div className="dn-desktop-plans">
        <TabBar
          items={copy.tabs}
          active={active}
          onChange={setActive}
          prefix="services"
        />
        <div
          id="services-panel"
          role="tabpanel"
          tabIndex="0"
          aria-labelledby={`services-tab-${active}`}
          className="dn-plan-panel"
        >
          <TierCards key={s.id} tiers={s.tiers} compact />
          <a className="dn-text-link" href={serviceHref(s)}>
            {copy.labels.learn}: {s.name}
            <Icon />
          </a>
        </div>
      </div>
      <div className="dn-mobile-plans">
        {services.map((service, i) => (
          <details
            key={service.id}
            name="service-plans"
            open={active === i}
            onToggle={(e) => {
              if (e.currentTarget.open) setActive(i);
            }}
          >
            <summary>
              {copy.tabs[i]}
              <Icon name="plus" />
            </summary>
            <TierCards tiers={service.tiers} compact />
            <a className="dn-text-link" href={serviceHref(service)}>
              {copy.labels.learn}
              <Icon />
            </a>
          </details>
        ))}
      </div>
    </>
  );
}
export function AIPlans() {
  const [active, setActive] = useState(0);
  return (
    <>
      <TabBar
        items={content.aiGroups.map((g) => g.name)}
        active={active}
        onChange={setActive}
        prefix="ai"
      />
      <div
        id="ai-panel"
        role="tabpanel"
        tabIndex="0"
        aria-labelledby={`ai-tab-${active}`}
      >
        <TierCards tiers={content.aiGroups[active].plans} />
      </div>
      {active === 0 && <p className="dn-footnote">{copy.aiFootnote}</p>}
    </>
  );
}
export function Process() {
  const [active, setActive] = useState(0);
  const root = useRef(null);
  const trigger = useRef(null);
  const cards = useRef(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 1000px) and (prefers-reduced-motion: no-preference)",
      () => {
        const panels = cards.current.children;
        gsap.set(panels, { opacity: 0, y: 45, rotation: 7 });
        gsap.set(panels[0], { opacity: 1, y: 0, rotation: 0 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 90px",
            end: "+=1800",
            pin: true,
            scrub: 1,
            onUpdate: (self) =>
              setActive(Math.min(4, Math.round(self.progress * 4))),
          },
        });
        trigger.current = tl.scrollTrigger;
        copy.process.slice(1).forEach((_, i) => {
          tl.to(
            panels[i],
            { opacity: 0, y: -45, rotation: -7, duration: 0.5 },
            i,
          ).to(
            panels[i + 1],
            { opacity: 1, y: 0, rotation: 0, duration: 0.5 },
            i,
          );
        });
        return () => {
          trigger.current = null;
        };
      },
    );
    return () => mm.revert();
  }, []);
  const select = (i) => {
    if (trigger.current) {
      const t = trigger.current;
      const target = t.start + (t.end - t.start) * Math.min(0.999, i / 4);
      if (window.dnLenis) window.dnLenis.scrollTo(target);
      else window.scrollTo({ top: target, behavior: "smooth" });
    } else setActive(i);
  };
  return (
    <div className="dn-process-layout" ref={root}>
      <div className="dn-process-copy">
        <span className="dn-eyebrow">
          <i />
          {copy.section.process[0]}
        </span>
        <h2>{copy.section.process[1]}</h2>
        <p className="dn-reveal">
          {copy.section.process[2].split(" ").map((w, i) => (
            <span key={i}>{w} </span>
          ))}
        </p>
        <div className="dn-process-controls" aria-label={ui.processSteps}>
          {copy.process.map((step, i) => (
            <button
              key={step.title}
              onClick={() => select(i)}
              className={i === active ? "dn-active" : ""}
              aria-label={`${i + 1}. ${step.title}${step.title.includes(step.short) ? "" : ": " + step.short}`}
              aria-pressed={i === active}
            >
              <Icon name={step.icon} />
              <span>{step.short}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="dn-process-panels" ref={cards}>
        {copy.process.map((step, i) => (
          <article
            className={`dn-process-card ${active === i ? "dn-active" : ""}`}
            key={step.title}
            aria-hidden={active !== i}
          >
            <div className="dn-process-card-top">
              <span>0{i + 1} / 05</span>
              <Icon name="arrow" />
            </div>
            <Artwork
              kind={step.icon}
              image={step.image}
              width="1200"
              height="800"
              compact
            />
            <div className="dn-process-card-bottom">
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
export function Projects() {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState(null);
  const swiper = useRef(null);
  const modal = useRef(null);
  const prev = useRef(null);
  useEffect(() => {
    if (selected === null) return;
    prev.current = document.activeElement;
    const d = modal.current;
    d.showModal();
    document.body.style.overflow = "hidden";
    window.dnLenis?.stop();
    return () => {
      d.close();
      document.body.style.overflow = "";
      window.dnLenis?.start();
      prev.current?.focus();
    };
  }, [selected]);
  const p = content.projects[active];
  return (
    <div className="dn-projects">
      <Swiper
        modules={[EffectCoverflow, Keyboard, A11y, Navigation]}
        onSwiper={(s) => (swiper.current = s)}
        onSlideChange={(s) => setActive(s.realIndex)}
        effect="coverflow"
        centeredSlides
        slidesPerView={1.18}
        spaceBetween={20}
        breakpoints={{
          768: { slidesPerView: 1.7, spaceBetween: 28 },
          1200: { slidesPerView: 2.15, spaceBetween: 38 },
        }}
        coverflowEffect={{
          rotate: 8,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }}
        keyboard={{ enabled: true, onlyInViewport: true }}
        a11y={{ enabled: true }}
        speed={550}
      >
        {content.projects.map((project, i) => {
          const screenshot = project.url && !project.previewUnavailable;
          return (
            <SwiperSlide key={project.name}>
              <button
                className={`dn-project-cover ${screenshot ? "" : "dn-project-concept"}`}
                aria-label={`${project.url ? copy.misc.projectVisit : copy.misc.projectDetail}: ${project.name}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => {
                  if (i !== active) {
                    swiper.current?.slideTo(i);
                    return;
                  }
                  if (project.url)
                    window.open(project.url, "_blank", "noopener,noreferrer");
                  else setSelected(i);
                }}
              >
                {project.image ? (
                  <img
                    src={project.image}
                    alt={screenshot ? `${project.name} ${ui.homepage}` : ""}
                    width="1440"
                    height="960"
                    loading="lazy"
                  />
                ) : (
                  <Artwork kind={project.icon} compact />
                )}
                {!screenshot && (
                  <div className="dn-product-title">
                    <span>
                      {project.previewUnavailable
                        ? copy.misc.previewUnavailable
                        : project.badge}
                    </span>
                    <strong>{project.name}</strong>
                    <Chips items={project.tags} />
                  </div>
                )}
                <span className="dn-project-open">
                  <Icon />
                </span>
              </button>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="dn-project-caption dn-container">
        <div className="dn-project-info" aria-live="polite">
          <span className="dn-eyebrow">
            {String(active + 1).padStart(2, "0")} / 13
          </span>
          {p.url ? (
            <a href={p.url} target="_blank" rel="noopener noreferrer">
              <h3>
                {p.name}
                <Icon />
              </h3>
            </a>
          ) : (
            <button onClick={() => setSelected(active)}>
              <h3>
                {p.name}
                <Icon />
              </h3>
            </button>
          )}
          <p>{p.description}</p>
        </div>
        <div className="dn-slider-controls">
          <button
            className="dn-round"
            disabled={active === 0}
            onClick={() => swiper.current?.slidePrev()}
            aria-label={ui.previousProject}
          >
            <Icon className="dn-arrow-prev" name="down" />
          </button>
          <button
            className="dn-round"
            disabled={active === content.projects.length - 1}
            onClick={() => swiper.current?.slideNext()}
            aria-label={ui.nextProject}
          >
            <Icon className="dn-arrow-next" name="down" />
          </button>
        </div>
      </div>
      <dialog
        className="dn-project-dialog"
        ref={modal}
        onCancel={() => setSelected(null)}
        aria-labelledby="project-dialog-title"
      >
        <button
          className="dn-round"
          onClick={() => setSelected(null)}
          aria-label={ui.closeProject}
        >
          <Icon name="close" />
        </button>
        {selected !== null && (
          <>
            <Artwork
              kind={content.projects[selected].icon}
              image={content.projects[selected].image}
              width="1440"
              height="960"
              compact
            />
            <span className="dn-eyebrow">
              {content.projects[selected].badge}
            </span>
            <h2 id="project-dialog-title">{content.projects[selected].name}</h2>
            <p>{content.projects[selected].description}</p>
            <Chips items={content.projects[selected].tags} />
            <a
              href="/#contact"
              className="dn-btn"
              onClick={() => setSelected(null)}
            >
              {copy.labels.quote}
              <Icon />
            </a>
          </>
        )}
      </dialog>
    </div>
  );
}
export function ContactForm() {
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [draft, setDraft] = useState("");
  function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form));
    const err = {};
    if (d.name.trim().length < 2) err.name = copy.form.invalidName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))
      err.email = copy.form.invalidEmail;
    if (d.phone && !/^[+\d\s()-]{7,22}$/.test(d.phone))
      err.phone = copy.form.invalidPhone;
    if (!d.service) err.service = copy.form.invalidService;
    if (d.message.trim().length < 10) err.message = copy.form.invalidMessage;
    setErrors(err);
    setSuccess(false);
    if (Object.keys(err).length) {
      form.elements[Object.keys(err)[0]].focus();
      return;
    }
    const body = `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone || ui.notSupplied}\nService: ${d.service}\n\n${d.message}`;
    const mail = `mailto:${content.company.email}?subject=${encodeURIComponent(ui.inquiry + d.service)}&body=${encodeURIComponent(body)}`;
    setDraft(mail);
    setSuccess(true);
    window.location.href = mail;
  }
  return (
    <form className="dn-contact-form" noValidate onSubmit={submit}>
      <div className="dn-form-grid">
        {["name", "email", "phone"].map((field) => (
          <div className="dn-field" key={field}>
            <label htmlFor={`contact-${field}`}>
              {copy.form[field]}{" "}
              {field === "phone" ? <span>{ui.optional}</span> : <span>*</span>}
            </label>
            <input
              id={`contact-${field}`}
              name={field}
              type={
                field === "email" ? "email" : field === "phone" ? "tel" : "text"
              }
              required={field !== "phone"}
              autoComplete={
                field === "name" ? "name" : field === "email" ? "email" : "tel"
              }
              aria-invalid={!!errors[field]}
              aria-describedby={errors[field] ? `error-${field}` : undefined}
              placeholder={
                field === "name"
                  ? ui.namePlaceholder
                  : field === "email"
                    ? ui.emailPlaceholder
                    : ui.phonePlaceholder
              }
            />
            {errors[field] && (
              <p id={`error-${field}`} className="dn-error">
                {errors[field]}
              </p>
            )}
          </div>
        ))}
        <div className="dn-field">
          <label htmlFor="contact-service">
            {copy.form.service} <span>*</span>
          </label>
          <select
            id="contact-service"
            name="service"
            required
            aria-invalid={!!errors.service}
            aria-describedby={errors.service ? "error-service" : undefined}
            defaultValue=""
          >
            <option value="" disabled>
              {copy.form.select}
            </option>
            {content.services.map((s) => (
              <option key={s.id}>{s.name}</option>
            ))}
          </select>
          {errors.service && (
            <p className="dn-error" id="error-service">
              {errors.service}
            </p>
          )}
        </div>
        <div className="dn-field dn-field-wide">
          <label htmlFor="contact-message">
            {copy.form.message} <span>*</span>
          </label>
          <textarea
            name="message"
            id="contact-message"
            rows="4"
            required
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "error-message" : undefined}
            placeholder={ui.messagePlaceholder}
          />
          {errors.message && (
            <p className="dn-error" id="error-message">
              {errors.message}
            </p>
          )}
        </div>
      </div>
      <button className="dn-btn" type="submit">
        {copy.labels.send}
        <Icon />
      </button>
      <div role="status" className="dn-form-status">
        {success && (
          <>
            <p>
              <Icon name="check" />
              {copy.form.success}
            </p>
            <a href={draft}>{copy.form.fallback}</a>
          </>
        )}
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html:
            "<!-- TODO(owner): Choose a contact form backend. This form currently prepares an email draft and does not submit to a server. -->",
        }}
      />
    </form>
  );
}
