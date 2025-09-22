import React from "react";
import "../../assets/css/home/entertainment-strip.css";

/**
 * Props:
 * title: string                // "Let us entertain you"
 * startDate: string|Date       // "2025-01-01"
 * endDate: string|Date         // "2025-12-30"
 * feature: {
 *   image: string
 *   alt?: string
 *   headline: string
 *   kicker?: string            // small all-caps, e.g., hotel name
 *   excerpt: string
 * }
 */
export default function EntertainmentStrip({
  title = "Let us entertain you",
  startDate = "2025-01-01",
  endDate = "2025-12-30",
  feature = {
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
    alt: "Live show",
    headline: "Nights Filled With Dancing and Live Shows",
    kicker: "Rixos Sharm El Sheikh Adults Only 18+",
    excerpt:
      "Beach parties, performances from renowned DJs, exciting dance shows and more are all on offer as part of the celebrated entertainment."
  }
}) {
  const fmt = (d) => new Date(d);

  const start = fmt(startDate);
  const end = fmt(endDate);

  const pad2 = (n) => String(n).padStart(2, "0");
  const startDay = pad2(start.getDate());
  const endDay = pad2(end.getDate());

  const monthShort = (d) =>
    d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const startMonth = `${monthShort(start)} ${start.getFullYear()}`;
  const endMonth = `${monthShort(end)} ${end.getFullYear()}`;

  return (
    <section className="ent-section">
      <div className="container-xxl">
        <div className="row g-4 align-items-start">
          {/* Left: heading */}
          <div className="col-lg-4">
            <h2 className="ent-title">
              {title.split(" ").slice(0, 3).join(" ")}{" "}
              <br />
              {title.split(" ").slice(3).join(" ")}
            </h2>
          </div>

          {/* Middle: date range */}
          <div className="col-lg-2">
            <div className="ent-range">
              <div className="ent-days">
                <span className="ent-day">{startDay}</span>
                <span className="ent-to">to</span>
                <span className="ent-day">{endDay}</span>
              </div>
              <div className="ent-months">
                <span className="ent-month">{startMonth}</span>
                <span className="ent-month">{endMonth}</span>
              </div>
            </div>
          </div>

          {/* Right: feature content */}
          <div className="col-lg-6">
            <article className="ent-feature">
              <div className="ent-cover">
                <img src={feature.image} alt={feature.alt || feature.headline} />
              </div>
              <div className="ent-copy">
                <h3 className="ent-headline">{feature.headline}</h3>
                {feature.kicker && (
                  <div className="ent-kicker">{feature.kicker}</div>
                )}
                <p className="ent-excerpt">{feature.excerpt}</p>
              </div>
            </article>
          </div>
        </div>

        {/* Divider */}
        <div className="ent-divider" />
      </div>
    </section>
  );
}
