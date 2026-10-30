import {
  content,
  copy,
  founder,
  serviceHref,
  siteUrl,
  ui,
} from "../lib/content";
import { Icon } from "../components/Icons";
import Artwork from "../components/Artwork";
import { Button, Chips, SectionHeading, RevealText } from "../components/Shell";
import {
  ServicePlans,
  AIPlans,
  Process,
  Projects,
  ContactForm,
} from "../components/Interactive";

function Marquee({ projects = false }) {
  const words = projects ? ["Our Showcase", "Our Showcase"] : copy.marquee;
  return (
    <div
      className={`dn-marquee ${projects ? "dn-project-marquee" : ""}`}
      role="img"
      aria-label={words.join(", ")}
    >
      <div className="dn-marquee-track" aria-hidden="true">
        {[0, 1].map((n) => (
          <div className="dn-marquee-group" key={n}>
            {words.map((word, i) => (
              <span key={i}>
                {word}
                <Icon name="spark" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: content.company.name,
    founder: {
      "@type": "Person",
      name: founder.name,
      image: `${siteUrl}${founder.image}`,
    },
    telephone: "+919173340223",
    email: content.company.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ahmedabad",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    areaServed: ["India", "Worldwide"],
    makesOffer: content.services.slice(0, 13).map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.name,
        description: s.description,
      },
    })),
  };
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replaceAll("<", "\\u003c"),
        }}
      />
      <section className="dn-hero dn-container" aria-labelledby="hero-title">
        <div className="dn-hero-topline">
          <span className="dn-location">
            <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
              <circle cx="4" cy="4" r="4" fill="currentColor" />
            </svg>
            {content.hero.availability}
          </span>
          <span className="dn-hero-note">{content.company.signoff}</span>
        </div>
        <div className="dn-hero-main">
          <div className="dn-hero-ribbon dn-parallax">
            <div className="dn-float">
              <img
                src="/img/hero-d-ribbon.webp"
                width="1024"
                height="1024"
                alt=""
                fetchPriority="high"
              />
            </div>
          </div>
          <div className="dn-hero-shield dn-parallax">
            <div className="dn-float">
              <img src="/img/hero-security-shield.webp" width="1024" height="1024" alt="" />
            </div>
          </div>
          <div className="dn-hero-chat dn-parallax">
            <div className="dn-float">
              <img src="/img/hero-ai-conversation.webp" width="1024" height="1024" alt="" />
            </div>
          </div>
          <div className="dn-hero-scan dn-parallax">
            <div className="dn-float">
              <img src="/img/hero-vision-viewfinder.webp" width="1024" height="1024" alt="" />
            </div>
          </div>
          <h1 id="hero-title" aria-label={ui.heroAccessible}>
            <span className="dn-hero-line">
              {content.hero.intro}{" "}
              <span className="dn-ticker" aria-hidden="true">
                <span className="dn-ticker-track" aria-hidden="true">
                  {Array.from({ length: 10 }, (_, n) =>
                    content.hero.words.map((w, i) => (
                      <span key={`${n}-${i}`}>{w}</span>
                    )),
                  )}
                </span>
              </span>
            </span>
            <span className="dn-hero-line dn-hero-second">
              <Icon className="dn-hero-spark" name="spark" />
              {content.hero.ending}
            </span>
          </h1>
          <RevealText
            text={content.hero.description}
            className="dn-hero-description"
          />
          <div className="dn-actions dn-hero-actions">
            <Button href="#contact">{copy.labels.quote}</Button>
            <Button href="#services" outline>
              {copy.labels.services}
            </Button>
          </div>
          <p className="dn-trust">
            <Icon name="shield" />
            {content.hero.trust}
          </p>
        </div>
        <div className="dn-hero-bottom">
          <span>{ui.heroKicker}</span>
          <a href="#services" aria-label={ui.heroExplore}>
            <span>{ui.heroExplore}</span>
            <Icon name="down" />
          </a>
          <span>{ui.heroEndnote}</span>
        </div>
      </section>
      <section id="services" className="dn-section dn-container">
        <SectionHeading data={copy.section.services} />
        <div className="dn-services-grid">
          {content.services.map((s) => {
            const href = serviceHref(s);
            const card = (
              <>
                <div className="dn-service-visual">
                  <Artwork kind={s.icon} image={s.image} label={s.name} />
                  {s.badge && (
                    <span
                      className={`dn-badge ${s.badge === "Featured" ? "dn-badge-featured" : ""}`}
                    >
                      <Icon
                        name={
                          s.badge === "Security"
                            ? "shield"
                            : s.badge === "Live"
                              ? "chat"
                              : "spark"
                        }
                      />
                      {s.badge}
                    </span>
                  )}
                  {href && (
                    <span className="dn-card-arrow">
                      <Icon />
                    </span>
                  )}
                </div>
                <div className="dn-service-caption">
                  <h3>{s.name}</h3>
                  <span>/{String(s.id).padStart(2, "0")}</span>
                </div>
                <p>{s.description}</p>
              </>
            );
            return (
              <article
                id={`service-${s.id}`}
                className="dn-service-card dn-fade"
                key={s.id}
              >
                {href ? (
                  <a href={href}>{card}</a>
                ) : (
                  <div>
                    {card}
                    <span
                      dangerouslySetInnerHTML={{
                        __html:
                          "<!-- TODO(owner): Supply Photography and Videography service details. -->",
                      }}
                    />
                  </div>
                )}
              </article>
            );
          })}
          <div className="dn-coming-soon dn-fade">
            <Icon name="spark" />
            <h3>{copy.misc.more}</h3>
          </div>
        </div>
      </section>
      <Marquee />
      <section
        className="dn-section dn-container dn-pillars"
        aria-label={ui.pillars}
      >
        {copy.pillars.map((p, i) => (
          <article key={p.name} className={`dn-pillar dn-fade dn-pillar-${i}`}>
            <span className="dn-eyebrow">02 / {p.name.toUpperCase()}</span>
            <h2>
              {p.name}
              <Icon />
            </h2>
            <Chips items={p.tags} />
            <p>{p.text}</p>
            <Artwork
              kind={p.icon}
              image={p.image}
              width="1400"
              height="1000"
              compact
            />
            <a href={`#${p.target}`} className="dn-text-link">
              {p.link}
              <Icon />
            </a>
          </article>
        ))}
      </section>
      <section id="plans" className="dn-section dn-container">
        <SectionHeading data={copy.section.plans} />
        <ServicePlans />
      </section>
      <section id="process" className="dn-section dn-container">
        <Process />
      </section>
      <section id="projects" className="dn-section dn-project-section">
        <Marquee projects />
        <div className="dn-container">
          <SectionHeading data={copy.section.projects} />
        </div>
        <Projects />
      </section>
      <section className="dn-section dn-tools">
        <div className="dn-tools-heading dn-container">
          <div className="dn-tools-object dn-parallax" aria-hidden="true">
            <div className="dn-float">
              <img src="/img/hero-d-ribbon.webp" width="1024" height="1024" alt="" loading="lazy" />
            </div>
          </div>
          <div className="dn-tools-shield dn-parallax" aria-hidden="true">
            <div className="dn-float">
              <img src="/img/hero-security-shield.webp" width="1024" height="1024" alt="" loading="lazy" />
            </div>
          </div>
          <SectionHeading data={copy.section.tools} center />
        </div>
        <div
          className="dn-tools-strip"
          tabIndex="0"
          role="region"
          aria-label={copy.section.tools[1]}
        >
          <div className="dn-marquee-track">
            {[0, 1].map((n) => (
              <div
                className="dn-tools-group"
                key={n}
                aria-hidden={n === 1 ? true : undefined}
              >
                {copy.tools.map((t, i) => (
                  <article className="dn-tool-card" key={t.name}>
                    <span className="dn-tool-index">0{i + 1}</span>
                    <Icon
                      name={
                        [
                          "cloud",
                          "browser",
                          "spark",
                          "scan",
                          "layers",
                          "target",
                        ][i]
                      }
                    />
                    <h3>{t.name}</h3>
                    <Chips items={t.items} />
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="why-us" className="dn-section dn-container">
        <div className="dn-why-intro">
          <div>
            <SectionHeading data={copy.section.why} />
            <Chips items={ui.whyChips} />
          </div>
          <div className="dn-why-mark dn-parallax" aria-hidden="true">
            <div className="dn-float">
              <img src="/img/hero-d-ribbon.webp" width="1024" height="1024" alt="" loading="lazy" />
            </div>
          </div>
        </div>
        <div className="dn-bento">
          {copy.reasons.map((r, i) => (
            <article
              key={r.title}
              className={`dn-bento-card dn-bento-${i} dn-fade`}
            >
              <Icon name={r.icon} />
              <h3>{r.title}</h3>
              <Chips items={r.tags} />
              <p>{r.text}</p>
              {r.image && (
                <div className="dn-bento-art dn-bento-photo">
                  <Artwork
                    image={r.image}
                    width={r.imageSize[0]}
                    height={r.imageSize[1]}
                    compact
                  />
                </div>
              )}
            </article>
          ))}
        </div>
        <p className="dn-and-more">
          {copy.misc.extra}
          <Icon name="spark" />
        </p>
        <div className="dn-stats">
          {copy.stats.map((s) => (
            <div key={s.label}>
              <strong>
                <span className="dn-sr-only">
                  {s.prefix}
                  {s.value}
                  {s.suffix}
                </span>
                <span aria-hidden="true">
                  {s.prefix}
                  <span data-count={s.value}>{s.value}</span>
                  {s.suffix}
                </span>
              </strong>
              <p>{s.label}</p>
            </div>
          ))}
        </div>
      </section>
      <section
        id="founder"
        className="dn-section dn-container dn-founder-preview"
      >
        <div className="dn-founder-preview-copy dn-fade">
          <span className="dn-eyebrow">
            <i />
            {copy.section.founder[0]}
          </span>
          <h2>{copy.section.founder[1]}</h2>
          <p>{copy.section.founder[2]}</p>
          <a className="dn-text-link" href="/founder/">
            {founder.linkLabel}
            <Icon />
          </a>
        </div>
        <a
          className="dn-founder-preview-photo"
          href="/founder/"
          aria-label={founder.linkLabel}
        >
          <img
            src={founder.image}
            alt={founder.imageAlt}
            width="1200"
            height="900"
            loading="lazy"
          />
        </a>
      </section>
      <section id="ai-plans" className="dn-section dn-container">
        <SectionHeading data={copy.section.ai} />
        <AIPlans />
        <div className="dn-addons">
          <p>{copy.misc.addon}</p>
          <Chips items={copy.addOns} />
        </div>
      </section>
      <section className="dn-section dn-cta dn-container">
        <Icon className="dn-cta-spark dn-float" name="spark" />
        <h2 className="dn-fade">{copy.cta.title}</h2>
        <p>{copy.cta.text}</p>
        <Button href={`mailto:${content.company.email}`}>
          {copy.labels.touch}
        </Button>
        <small>{content.company.signoff}</small>
      </section>
      <section id="contact" className="dn-section dn-container dn-contact">
        <div>
          <SectionHeading data={copy.section.contact} />
          <div className="dn-contact-links">
            <a href={`mailto:${content.company.email}`}>
              <Icon name="mail" />
              {content.company.email}
            </a>
            <a href={content.company.tel}>
              <Icon name="phone" />
              {content.company.phone}
            </a>
            <p>
              <Icon name="pin" />
              {content.company.location}
            </p>
          </div>
          <Button
            outline
            href={content.company.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.labels.whatsapp}
          </Button>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
