import { content, copy, founder } from "../../lib/content";
import { Icon } from "../../components/Icons";
import { Button, Chips } from "../../components/Shell";

export const metadata = {
  title: `${founder.name} | Founder | ${content.company.name}`,
  description: `${founder.name} is the founder of Devnandan IT Solutions and holds a B.Tech in Information Technology.`,
  alternates: { canonical: "/founder/" },
  openGraph: {
    title: `${founder.name} | ${content.company.name}`,
    description: founder.about,
    images: [founder.image],
  },
};

export default function FounderPage() {
  return (
    <main id="main" className="dn-founder-page">
      <section className="dn-founder-hero dn-container">
        <a className="dn-text-link" href="/">
          <Icon className="dn-arrow-prev" name="down" />
          {copy.labels.back}
        </a>
        <div className="dn-founder-hero-grid">
          <div className="dn-founder-intro">
            <span className="dn-eyebrow">
              <i />
              {founder.profileLabel}
            </span>
            <h1>{founder.name}</h1>
            <p>{founder.intro}</p>
            <Chips items={[founder.role, founder.qualification]} />
            <Button href="/#contact">{copy.labels.touch}</Button>
          </div>
          <figure className="dn-founder-portrait">
            <img
              src={founder.image}
              width="1200"
              height="900"
              alt={founder.imageAlt}
              fetchPriority="high"
            />
            <figcaption>
              <span>{founder.name}</span>
              <span>{founder.role}</span>
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="dn-founder-about dn-container dn-section">
        <div>
          <span className="dn-eyebrow">
            <i />
            {founder.aboutLabel}
          </span>
          <h2>{founder.aboutTitle}</h2>
        </div>
        <div>
          <p>{founder.about}</p>
          <p>{founder.company}</p>
          <Button href="/#services" outline>
            {copy.labels.services}
          </Button>
        </div>
      </section>
      <section className="dn-section dn-cta dn-container">
        <h2>{copy.cta.title}</h2>
        <p>{copy.cta.text}</p>
        <Button href="/#contact">{copy.labels.quote}</Button>
      </section>
    </main>
  );
}
