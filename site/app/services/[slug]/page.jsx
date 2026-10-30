import { notFound } from "next/navigation";
import { content, copy, serviceHref } from "../../../lib/content";
import { Icon } from "../../../components/Icons";
import Artwork from "../../../components/Artwork";
import { Button, Chips } from "../../../components/Shell";
import { TierCards } from "../../../components/Interactive";
export const dynamicParams = false;
export function generateStaticParams() {
  return content.services.filter((s) => s.slug).map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = content.services.find((s) => s.slug === slug);
  return {
    title: `${s?.name} | ${content.company.name}`,
    description: s?.description,
    alternates: { canonical: `/services/${slug}/` },
  };
}
export default async function ServicePage({ params }) {
  const { slug } = await params;
  const s = content.services.find((s) => s.slug === slug);
  if (!s) notFound();
  return (
    <main id="main" className="dn-detail">
      <section className="dn-detail-hero dn-container">
        <a className="dn-text-link" href="/#services">
          <Icon className="dn-arrow-prev" name="down" />
          {copy.misc.all}
        </a>
        <div className="dn-detail-hero-grid">
          <div>
            <span className="dn-eyebrow">
              /{String(s.id).padStart(2, "0")} / {copy.misc.tech}
            </span>
            <h1>{s.name}</h1>
            <p>{s.description}</p>
            <Button>{copy.labels.quote}</Button>
          </div>
          <Artwork kind={s.icon} image={s.image} compact />
        </div>
      </section>
      {s.trust && (
        <div className="dn-container">
          <p className="dn-trust dn-trust-banner">
            <Icon name="shield" />
            {s.trust}
          </p>
        </div>
      )}
      <section className="dn-section dn-container">
        <h2>{s.tiers.length ? copy.section.plans[1] : s.name}</h2>
        {s.id === 4 ? (
          content.aiGroups.map((g) => (
            <div className="dn-detail-plans" key={g.name}>
              <h3 className="dn-group-title">{g.name}</h3>
              <TierCards tiers={g.plans} />
              {g === content.aiGroups[0] && (
                <p className="dn-footnote">{copy.aiFootnote}</p>
              )}
            </div>
          ))
        ) : s.tiers.length ? (
          <TierCards tiers={s.tiers} />
        ) : (
          <ul className="dn-feature-list">
            {s.features.map((f) => (
              <li key={f}>
                <Icon name="check" />
                {f}
              </li>
            ))}
          </ul>
        )}
        {s.also && (
          <p className="dn-also">
            <em>{s.also}</em>
          </p>
        )}
      </section>
      <section className="dn-container dn-section">
        <h2>{copy.misc.steps}</h2>
        <div className="dn-detail-process">
          {copy.process.map((step, i) => (
            <article key={step.title}>
              <span>0{i + 1}</span>
              <Icon name={step.icon} />
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="dn-section dn-container dn-cta">
        <h2>{copy.cta.title}</h2>
        <p>{copy.cta.text}</p>
        <Button>{copy.labels.quote}</Button>
      </section>
    </main>
  );
}
