import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="about-page">
      <header className="about-header">
        <Link className="brand landing-brand" href="/" aria-label="Krishi Hub home">
          <span className="brand-mark"><img src="/krishi-logo.png" alt="" /></span>
          <span>Krishi Hub</span>
        </Link>
        <a className="about-home-link" href="/"><span aria-hidden="true">←</span> Back to home</a>
      </header>

      <section className="about-hero">
        <div className="about-hero-copy">
          <p className="about-eyebrow">About Krishi Hub</p>
          <h1>Growing trust from farm to market.</h1>
          <p>We bring farmers and buyers closer through transparent trade, dependable connections, and technology designed around real agricultural communities.</p>
        </div>
        <div className="about-hero-visual">
          <img src="/krishi-hub-collection.png" alt="Fresh produce available through Krishi Hub" />
        </div>
      </section>

      <section className="about-story">
        <div>
          <p className="about-eyebrow">Our purpose</p>
          <h2>Every harvest deserves a fair opportunity.</h2>
        </div>
        <p>Krishi Hub makes it simpler for farmers to reach buyers and for buyers to source fresh, trusted produce. Our platform supports clear pricing, easier order management, and stronger relationships across the agricultural supply chain.</p>
      </section>

      <section className="about-values" aria-label="Our values">
        <article><span>01</span><h3>Fair opportunities</h3><p>Helping farmers access markets with clarity and confidence.</p></article>
        <article><span>02</span><h3>Stronger communities</h3><p>Building lasting connections between growers and buyers.</p></article>
        <article><span>03</span><h3>Trusted produce</h3><p>Supporting dependable sourcing from farm to destination.</p></article>
      </section>
    </main>
  );
}
