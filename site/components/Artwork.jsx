import { Icon, Ribbon } from "./Icons";
import { copy, ui } from "../lib/content";

export default function Artwork({
  kind = "browser",
  label = "",
  compact = false,
  image = null,
  width = 1600,
  height = 1000,
}) {
  if (image) {
    return (
      <div className={`dn-art dn-art-image ${compact ? "dn-art-compact" : ""}`} aria-hidden="true">
        <img src={image} width={width} height={height} alt="" loading="lazy" />
        {!compact && (
          <span className="dn-art-caption">
            {label || copy.misc.illustration}
            <span>{ui.visual.studio}</span>
          </span>
        )}
      </div>
    );
  }
  return (
    <div
      className={`dn-art dn-art-${kind} ${compact ? "dn-art-compact" : ""}`}
      aria-hidden="true"
    >
      <div className="dn-art-grid" />
      <div className="dn-art-glow" />
      {kind === "browser" || kind === "code" ? (
        <div className="dn-mini-browser">
          <div className="dn-window-bar">
            <i />
            <i />
            <i />
            <span>
              {kind === "code" ? ui.visual.workspace : ui.visual.browser}
            </span>
          </div>
          <div className="dn-browser-content">
            <div className="dn-mini-sidebar">
              <Icon name="spark" />
              <b />
              <b />
              <b />
            </div>
            <div className="dn-mini-page">
              <span className="dn-mini-tag">{ui.visual.eyebrow}</span>
              <strong>
                {ui.visual.headline[0]}
                <br />
                {ui.visual.headline[1]}
              </strong>
              <span className="dn-mini-button">
                {ui.visual.button} <Icon />
              </span>
              <div className="dn-mini-lines">
                <i />
                <i />
              </div>
            </div>
            <Ribbon className="dn-browser-ribbon" />
          </div>
        </div>
      ) : kind === "phone" ? (
        <div className="dn-phones">
          <div className="dn-phone dn-phone-back">
            <div className="dn-phone-notch" />
            <Icon name="spark" />
            <div className="dn-phone-tiles">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="dn-phone">
            <div className="dn-phone-notch" />
            <span>{ui.visual.phoneEyebrow}</span>
            <strong>
              {ui.visual.phoneHeadline[0]}
              <br />
              {ui.visual.phoneHeadline[1]}
            </strong>
            <div className="dn-phone-orb">
              <Icon name="layers" />
            </div>
            <div className="dn-phone-nav">
              <Icon name="globe" />
              <Icon name="chat" />
              <Icon name="plus" />
            </div>
          </div>
        </div>
      ) : kind === "chat" || kind === "spark" ? (
        <div className="dn-chat-art">
          <div className="dn-ai-orb">
            <Icon name={kind} />
          </div>
          <div className="dn-message dn-message-one">
            <i />
            <i />
            <i />
          </div>
          <div className="dn-message dn-message-two">
            <Icon name="check" />
            <div>
              <i />
              <i />
            </div>
          </div>
          <div className="dn-wave">
            {Array.from({ length: 15 }, (_, i) => (
              <i
                key={i}
                style={{ height: `${18 + Math.sin(i * 1.4) ** 2 * 40}px` }}
              />
            ))}
          </div>
        </div>
      ) : kind === "target" || kind === "globe" || kind === "share" ? (
        <div className="dn-growth-art">
          <div className="dn-chart">
            {[26, 41, 37, 62, 56, 78, 95].map((h, i) => (
              <i key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="dn-growth-badge">
            <Icon name={kind} />
          </div>
          <svg className="dn-chart-line" viewBox="0 0 300 150">
            <path
              d="M0 140 45 110 90 120 140 70 190 80 240 35 295 5"
              fill="none"
              stroke="#9acbff"
              strokeWidth="3"
            />
          </svg>
        </div>
      ) : kind === "scan" ? (
        <div className="dn-scan-art">
          <div className="dn-scan-subject" />
          <span className="dn-detection dn-detection-one" />
          <span className="dn-detection dn-detection-two" />
          <div className="dn-scan-line" />
          <Icon name="scan" />
        </div>
      ) : kind === "layers" || kind === "cloud" ? (
        <div className="dn-stack-art">
          <div />
          <div />
          <div />
          <span>
            <Icon name={kind} />
          </span>
        </div>
      ) : kind === "pen" ? (
        <div className="dn-design-art">
          <div className="dn-design-sheet">
            <span>{ui.visual.type}</span>
            <div>
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="dn-design-icon">
            <Icon name="pen" />
          </div>
        </div>
      ) : (
        <div className="dn-object-art">
          <div className="dn-orbit" />
          <div className="dn-orbit dn-orbit-two" />
          <div className="dn-object">
            <Icon name={kind} />
          </div>
          <span className="dn-orbit-dot" />
        </div>
      )}
      {!compact && (
        <span className="dn-art-caption">
          {label || copy.misc.illustration}
          <span>{ui.visual.studio}</span>
        </span>
      )}
    </div>
  );
}
