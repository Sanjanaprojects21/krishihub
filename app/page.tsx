"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AuthMode = "signin" | "signup";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [helpRating, setHelpRating] = useState(0);
  const isSignUp = mode === "signup";

  useEffect(() => {
    if (showHelp) {
      document.getElementById("help-center")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showHelp]);

  return (
    <main className="landing-page" id="home-page-top">
      <img className="landing-corner landing-corner-tomato" src="/produce/tomato.svg" alt="" aria-hidden="true" />
      <img className="landing-corner landing-corner-mango" src="/produce/mango.svg" alt="" aria-hidden="true" />
      <img className="landing-corner landing-corner-carrot" src="/produce/carrot.svg" alt="" aria-hidden="true" />
      <img className="landing-corner landing-corner-apple" src="/produce/apple.svg" alt="" aria-hidden="true" />

      <header className="landing-header">
        <a className="brand landing-brand" href="/" aria-label="Krishi Hub home">
          <span className="brand-mark"><img src="/krishi-logo.png" alt="" /></span>
          <span>Krishi Hub</span>
        </a>

        <nav className="landing-nav" aria-label="Main navigation">
          <a href="/about">About us</a>
          <a
            href="#help-center"
            onClick={(event) => {
              event.preventDefault();
              setShowHelp(true);
            }}
          >
            Help
          </a>
        </nav>

        <div className="landing-account-actions">
          <button className="landing-signin" type="button" onClick={() => setMode("signin")}>
            Sign in
          </button>
          <button className="primary-button landing-signup" type="button" onClick={() => setMode("signup")}>
            Create account
          </button>
        </div>
      </header>

      <section className="landing-hero" id="home" aria-labelledby="landing-title">
        <div className="landing-hero-copy">
          <div className="landing-badge">
            <span aria-hidden="true">●</span>
            India&apos;s farm-to-market network
          </div>
          <h1 id="landing-title">
            Fresh harvests.
            <span>Fair connections.</span>
          </h1>
          <p>
            Krishi Hub brings farmers and buyers together in one trusted marketplace—making fresh produce easier to sell, source, and deliver.
          </p>

          <div className="landing-trust-row" aria-label="Krishi Hub benefits">
            <span><strong>100%</strong> transparent</span>
            <span><strong>Fresh</strong> farm produce</span>
            <span><strong>Direct</strong> connections</span>
          </div>
        </div>

        <div className="landing-visual" aria-label="Krishi Hub fresh produce marketplace">
          <div className="landing-image-frame">
            <img
              className="landing-collection-image"
              src="/krishi-hub-collection.png"
              alt="Krishi Hub fresh vegetable collection"
            />
          </div>
        </div>
      </section>

      {showHelp && (
        <section className="help-center" id="help-center" aria-labelledby="help-center-title">
          <a
            className="help-back"
            href="/"
          >
            <span aria-hidden="true">←</span> Back to home
          </a>

          <header className="help-hero">
            <p className="help-eyebrow">Help Center</p>
            <h2 id="help-center-title">How can we help?</h2>
            <label className="help-search">
              <span aria-hidden="true">⌕</span>
              <span className="sr-only">Search the Help Center</span>
              <input type="search" placeholder="Search for answers, topics, or services" />
            </label>
          </header>

          <div className="help-content-grid">
            <section className="help-card help-topics" aria-labelledby="popular-topics-title">
              <div className="help-section-heading">
                <p>Explore</p>
                <h3 id="popular-topics-title">Popular Topics</h3>
              </div>
              <div className="help-topic-grid">
                {[
                  ["Orders", "Track and manage purchases"],
                  ["Wallet", "Payments and balance"],
                  ["Sell Crops", "List produce for buyers"],
                  ["Delivery", "Shipping and fulfilment"],
                  ["Account", "Profile and security"],
                ].map(([title, description]) => (
                  <button type="button" key={title}>
                    <strong>{title}</strong>
                    <span>{description}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="help-card help-faqs" aria-labelledby="faq-title">
              <div className="help-section-heading">
                <p>Quick answers</p>
                <h3 id="faq-title">FAQs</h3>
              </div>
              <div className="help-faq-list">
                <details><summary>How to place an order?</summary><p>Sign in as a buyer, select produce, choose the quantity, add it to your cart, and continue to checkout.</p></details>
                <details><summary>How to track an order?</summary><p>Open your buyer dashboard and select Orders to view the latest status and delivery progress.</p></details>
                <details><summary>How to add money to wallet?</summary><p>Go to Wallet in your dashboard, enter an amount, choose a payment method, and confirm the transaction.</p></details>
                <details><summary>How to become a seller?</summary><p>Create a farmer account, complete your profile, and add your first crop listing from the farmer dashboard.</p></details>
              </div>
            </section>
          </div>

          <section className="help-card help-support" aria-labelledby="support-title">
            <div className="help-section-heading">
              <p>Contact us</p>
              <h3 id="support-title">Need More Help?</h3>
            </div>
            <div className="help-support-grid">
              <a href="tel:+911800000000"><strong>Call Support</strong><span>Speak with our support team</span></a>
              <a href="mailto:support@krishihub.com"><strong>Email Support</strong><span>Get a response by email</span></a>
              <button type="button"><strong>Live Chat</strong><span>Start a conversation now</span></button>
              <button type="button"><strong>Report an Issue</strong><span>Tell us what went wrong</span></button>
            </div>
          </section>

          <section className="help-rating" aria-labelledby="rating-title">
            <div><p>Feedback</p><h3 id="rating-title">Rate Your Experience</h3></div>
            <div className="help-stars" role="group" aria-label="Rate your experience">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  className={rating <= helpRating ? "is-active" : ""}
                  type="button"
                  key={rating}
                  onClick={() => setHelpRating(rating)}
                  aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
                >★</button>
              ))}
            </div>
          </section>
        </section>
      )}

      <footer className="landing-footer">
        <div className="landing-footer-main">
          <div>
            <span className="landing-footer-eyebrow">Krishi Hub</span>
            <h2>Fresh harvests. Fair connections.</h2>
          </div>
          <p>
            A trusted digital marketplace connecting farmers and buyers through transparent trade and dependable delivery.
          </p>
        </div>

        <div className="landing-footer-values" aria-label="Our values">
          <span>Fair opportunities</span>
          <i />
          <span>Stronger communities</span>
          <i />
          <span>Fresh, trusted produce</span>
        </div>

        <div className="landing-footer-bottom">
          <span>© 2026 Krishi Hub</span>
          <span>Rooted in trust. Built for growth.</span>
        </div>
      </footer>

      {mode && (
        <div className="auth-modal-backdrop" role="presentation" onMouseDown={() => setMode(null)}>
          <section
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="auth-modal-close" type="button" onClick={() => setMode(null)} aria-label="Close authentication form">
              ×
            </button>

            <div className="auth-modal-brand">
              <span className="brand-mark"><img src="/krishi-logo.png" alt="" /></span>
              <span>Krishi Hub</span>
            </div>

            <div className="auth-modal-copy">
              <p className="eyebrow">Farm commerce platform</p>
              <h1 id="auth-modal-title">{isSignUp ? "Create your account" : "Welcome back"}</h1>
              <p>{isSignUp ? "Join Krishi Hub and start growing your business." : "Sign in to continue to your marketplace."}</p>
            </div>

            <form
              className="auth-form"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const businessType = formData.get("businessType");
                router.push(businessType === "farmer" ? "/dashboard/farmer" : "/dashboard/buyer");
              }}
            >
              {isSignUp && <label>Full name<input type="text" name="name" placeholder="Aarav Sharma" /></label>}
              <label>Email address<input type="email" name="email" placeholder="you@example.com" /></label>
              <label>Password<input type="password" name="password" placeholder="Enter password" /></label>
              <label>
                {isSignUp ? "Business type" : "Account type"}
                <select name="businessType" defaultValue="" required>
                  <option value="" disabled>Select account type</option>
                  <option value="farmer">Farmer</option>
                  <option value="buyer">Buyer</option>
                </select>
              </label>

              <div className="form-row">
                <label className="check-row">
                  <input type="checkbox" />
                  <span>{isSignUp ? "Send onboarding updates" : "Remember me"}</span>
                </label>
                {!isSignUp && <a href="#">Forgot password?</a>}
              </div>

              <button className="primary-button" type="submit">{isSignUp ? "Create account" : "Sign in"}</button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
