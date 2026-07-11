"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthMode = "signin" | "signup";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const isSignUp = mode === "signup";
  const authTitle = isSignUp ? "Create your account" : "Welcome";

  return (
    <main className="auth-page">
      <section className="auth-shell" aria-label="Krishi Hub authentication">
        <div className="auth-form-panel">
          <a className="brand" href="#" aria-label="Krishi Hub home">
            <span className="brand-mark">KH</span>
            <span>Krishi Hub</span>
          </a>

          <div className="form-copy">
            <p className="eyebrow">Farm commerce platform</p>
            <h1>{authTitle}</h1>
            <p>
              {isSignUp
                ? "Start managing produce orders, supplier relationships, and delivery updates from one clean workspace."
                : "Sign in to manage fresh produce orders, inventory updates, and customer requests."}
            </p>
          </div>

          <div className="mode-switch" aria-label="Authentication mode">
            <button
              className={mode === "signin" ? "active" : ""}
              type="button"
              onClick={() => setMode("signin")}
            >
              Sign in
            </button>
            <button
              className={mode === "signup" ? "active" : ""}
              type="button"
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>
          </div>

          <form
            className="auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const businessType = formData.get("businessType");
              const nextDashboard = businessType === "farmer" ? "/dashboard/farmer" : "/dashboard/buyer";

              router.push(nextDashboard);
            }}
          >
            {isSignUp && (
              <label>
                Full name
                <input type="text" name="name" placeholder="Aarav Sharma" />
              </label>
            )}

            <label>
              Email address
              <input type="email" name="email" placeholder="you@example.com" />
            </label>

            <label>
              Password
              <input type="password" name="password" placeholder="Enter password" />
            </label>

            <label>
              {isSignUp ? "Business type" : "Account type"}
              <select name="businessType" defaultValue="" required>
                <option value="" disabled>
                  Select account type
                </option>
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

            <button className="primary-button" type="submit">
              {isSignUp ? "Create account" : "Sign in"}
            </button>

            <a className="secondary-button" href="/dashboard/buyer">
              Skip and continue as buyer
            </a>
          </form>

          <p className="legal-copy">
            {isSignUp
              ? "By creating an account, you agree to secure and transparent marketplace operations."
              : "Protected access for registered Krishi Hub partners."}
          </p>
        </div>

        <aside className="visual-panel" aria-label="Krishi Hub overview">
          <div className="hero-card">
            <img
              className="hero-image"
              src="/krishi-hub-professional-farmer.png"
              alt="Krishi Hub farmer standing in a green field"
            />
          </div>
        </aside>
      </section>
    </main>
  );
}
