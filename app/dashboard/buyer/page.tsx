"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ProduceItem } from "../../../lib/produce-catalog";

type BuyerProduct = ProduceItem & {
  quantity: number;
};

type PaymentMethod = "cod" | "online";
type OnlinePaymentMethod = "phonepe" | "upi" | "card";

function priceValue(price: string) {
  const match = price.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export default function ProducePage() {
  const [items, setItems] = useState<ProduceItem[]>([]);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<ProduceItem | null>(null);
  const [buyerProducts, setBuyerProducts] = useState<BuyerProduct[]>([]);
  const [draftQuantities, setDraftQuantities] = useState<Record<string, number>>({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [onlinePaymentMethod, setOnlinePaymentMethod] = useState<OnlinePaymentMethod>("phonepe");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProduce() {
      try {
        const response = await fetch("/api/produce");

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const data = (await response.json()) as { items?: ProduceItem[] };

        if (!active) {
          return;
        }

        const nextItems = data.items ?? [];
        setItems(nextItems);
        setSelected(nextItems[0] ?? null);
      } catch {
        if (active) {
          setError("Unable to load produce data.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProduce();

    return () => {
      active = false;
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredProduce = useMemo(() => {
    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => {
      const itemName = item.name.toLowerCase();
      const itemType = item.type.toLowerCase();
      const isVegetableSearch = ["veg", "vegetable", "vegetables", "vegtable", "vegatables"].includes(normalizedQuery);
      const isFruitSearch = ["fruit", "fruits"].includes(normalizedQuery);

      return (
        itemName.includes(normalizedQuery) ||
        itemType.includes(normalizedQuery) ||
        (isVegetableSearch && item.type === "Vegetable") ||
        (isFruitSearch && item.type === "Fruit")
      );
    });
  }, [items, normalizedQuery]);

  const searchMatch = filteredProduce[0] ?? null;
  const activeItem = normalizedQuery && searchMatch ? searchMatch : selected;
  const demoProduce = items.filter((item) => item.featured);
  const vegetables = demoProduce.filter((item) => item.type === "Vegetable");
  const fruits = demoProduce.filter((item) => item.type === "Fruit");
  const showSearchResults = normalizedQuery.length > 0;
  const buyerName = "Buyer";
  const cartTotal = buyerProducts.reduce((total, item) => total + priceValue(item.price) * item.quantity, 0);

  function addToCart(item: ProduceItem, quantity = 1) {
    setBuyerProducts((current) =>
      current.some((product) => product.key === item.key)
        ? current
        : [{ ...item, quantity }, ...current],
    );
  }

  function changeQuantity(itemKey: string, amount: number) {
    setBuyerProducts((current) =>
      current
        .map((product) =>
          product.key === itemKey
            ? { ...product, quantity: product.quantity + amount }
            : product,
        )
        .filter((product) => product.quantity > 0),
    );
  }

  function renderCartControl(item: ProduceItem, className: string) {
    const cartItem = buyerProducts.find((product) => product.key === item.key);
    const quantity = cartItem?.quantity ?? draftQuantities[item.key] ?? 1;

    function updateQuantity(amount: number) {
      if (cartItem) {
        changeQuantity(item.key, amount);
        return;
      }

      setDraftQuantities((current) => ({
        ...current,
        [item.key]: Math.max(1, quantity + amount),
      }));
    }

    return (
      <div className={`product-cart-control ${className}`}>
        <div className="product-quantity-selector" aria-label={`Quantity for ${item.name}`}>
          <button
            type="button"
            aria-label={cartItem?.quantity === 1 ? `Remove ${item.name} from cart` : `Reduce ${item.name} quantity`}
            onClick={() => updateQuantity(-1)}
          >
            &minus;
          </button>
          <span aria-live="polite">{quantity}</span>
          <button
            type="button"
            aria-label={`Increase ${item.name} quantity`}
            onClick={() => updateQuantity(1)}
          >
            +
          </button>
        </div>
        <button
          className="primary-button product-cart-add"
          type="button"
          disabled={Boolean(cartItem)}
          onClick={() => addToCart(item, quantity)}
        >
          {cartItem ? "Added" : "Add to cart"}
        </button>
      </div>
    );
  }

  function renderProductCard(item: ProduceItem, stockLabel: string) {
    return (
      <article className="produce-card" key={item.key}>
        <button className="produce-card-select" type="button" onClick={() => setSelected(item)}>
          <img className="produce-photo" src={item.image} alt={item.name} loading="lazy" />
          <span className="produce-card-copy">
            <span className="produce-name">{item.name}</span>
            <span className="produce-stock">{stockLabel}</span>
            <span className="produce-price">{item.price}</span>
          </span>
        </button>
        {renderCartControl(item, "card-add-button")}
      </article>
    );
  }

  if (loading) {
    return (
      <main className="produce-page">
        <div className="produce-loading">Loading vegetables and fruits...</div>
      </main>
    );
  }

  return (
    <main className="produce-page">
      <header className="produce-header buyer-market-header">
        <a className="brand" href="/" aria-label="Krishi Hub home">
          <span className="brand-mark">KH</span>
          <span>Krishi Hub</span>
        </a>

        <div className="produce-title">
          <p className="eyebrow">Fresh marketplace</p>
          <h1>Vegetables &amp; Fruits</h1>
        </div>

        <a className="secondary-button produce-back" href="/">
          Back to login
        </a>
      </header>

      <section
        className={`produce-search-panel ${searchOpen ? "is-open" : ""}`}
        aria-label="Search produce"
      >
        <button
          className="produce-search-toggle"
          type="button"
          aria-label={searchOpen ? "Close produce search" : "Open produce search"}
          aria-expanded={searchOpen}
          aria-controls="produce-search"
          onClick={() => {
            const nextOpen = !searchOpen;
            setSearchOpen(nextOpen);
            if (nextOpen) {
              window.setTimeout(() => searchInputRef.current?.focus(), 0);
            }
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m21 21-4.35-4.35m2.35-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
          </svg>
        </button>
        <label className="sr-only" htmlFor="produce-search">Search vegetables or fruits</label>
        <input
          ref={searchInputRef}
          id="produce-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search produce..."
          tabIndex={searchOpen ? 0 : -1}
        />
      </section>

      {error ? <p className="empty-result">{error}</p> : null}

      <section className="buyer-dashboard-layout">
        <div className="buyer-market-main">
          {activeItem && !error && (
            <section className="produce-feature" aria-live="polite">
              <img className="produce-photo feature-photo" src={activeItem.image} alt={activeItem.name} />
              <div className="produce-feature-copy">
                <span>{activeItem.type}</span>
                <h2>{activeItem.name}</h2>
                <strong>{activeItem.price}</strong>
                {renderCartControl(activeItem, "add-product-button")}
              </div>
            </section>
          )}

          {!error && showSearchResults && filteredProduce.length === 0 ? (
            <p className="empty-result">No produce found for "{query}".</p>
          ) : !error && showSearchResults ? (
            <section className="produce-section search-products" aria-label="Search results">
              <div className="section-heading">
                <h2>Product result</h2>
                <span>{filteredProduce.length} matched</span>
              </div>

              <div className="produce-grid single-result-grid">
                {filteredProduce.map((item) => renderProductCard(item, item.type))}
              </div>
            </section>
          ) : !error ? (
            <>
              <section className="produce-section" aria-labelledby="vegetables-title">
                <div className="section-heading">
                  <h2 id="vegetables-title">Vegetables</h2>
                  <span>{vegetables.length} items</span>
                </div>

                <div className="produce-grid">
                  {vegetables.map((item) => renderProductCard(item, item.stock))}
                </div>
              </section>

              <section className="produce-section" aria-labelledby="fruits-title">
                <div className="section-heading">
                  <h2 id="fruits-title">Fruits</h2>
                  <span>{fruits.length} items</span>
                </div>

                <div className="produce-grid">
                  {fruits.map((item) => renderProductCard(item, item.stock))}
                </div>
              </section>
            </>
          ) : null}
        </div>

        <aside className="buyer-product-sidebar" aria-labelledby="buyer-products-title">
          <div className="buyer-sidebar-header">
            <div>
              <p className="eyebrow">Buyer cart</p>
              <h2 id="buyer-products-title">Your cart</h2>
            </div>
            <span>{buyerProducts.length}</span>
          </div>

          <div className="buyer-sidebar-user">
            <span>Shopping as</span>
            <strong>{buyerName}</strong>
          </div>

          {buyerProducts.length === 0 ? (
            <p className="buyer-empty-products">Choose products and add them to cart.</p>
          ) : (
            <div className="buyer-sidebar-list">
              {buyerProducts.map((item) => (
                <article className="buyer-sidebar-item" key={item.key}>
                  <img src={item.image} alt={item.name} />
                  <div className="buyer-sidebar-copy">
                    <strong>{item.name}</strong>
                    <span>{item.type}</span>
                    <span className="produce-price">{item.price}</span>
                  </div>
                  <div className="quantity-stepper" aria-label={`Quantity for ${item.name}`}>
                    <button
                      type="button"
                      aria-label={item.quantity === 1 ? `Remove ${item.name} from cart` : `Reduce ${item.name} quantity`}
                      onClick={() => changeQuantity(item.key, -1)}
                    >
                      &minus;
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${item.name} quantity`}
                      onClick={() => changeQuantity(item.key, 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-line-total">
                    <span>Total</span>
                    <strong>Rs {priceValue(item.price) * item.quantity}</strong>
                  </div>
                </article>
              ))}
              <div className="cart-total-panel">
                <span>Cart total</span>
                <strong>Rs {cartTotal}</strong>
              </div>
              <button
                className="primary-button checkout-button"
                type="button"
                onClick={() => setCheckoutOpen(true)}
              >
                Confirm and proceed
              </button>
            </div>
          )}
        </aside>
      </section>

      {checkoutOpen ? (
        <div className="checkout-overlay" role="presentation" onMouseDown={() => setCheckoutOpen(false)}>
          <section
            className="checkout-frame"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="checkout-frame-header">
              <div>
                <p className="eyebrow">Complete your order</p>
                <h2 id="checkout-title">Checkout</h2>
              </div>
              <button className="checkout-close" type="button" aria-label="Close checkout" onClick={() => setCheckoutOpen(false)}>
                &times;
              </button>
            </header>

            <form className="checkout-layout" onSubmit={(event) => event.preventDefault()}>
              <div className="checkout-details-column">
                <fieldset className="checkout-section delivery-address-panel">
                  <legend>Delivery details</legend>
                  <div className="address-field">
                    <label htmlFor="buyer-first-name">First name</label>
                    <input id="buyer-first-name" name="firstName" type="text" defaultValue={buyerName} autoComplete="given-name" required />
                  </div>
                  <div className="address-field">
                    <label htmlFor="buyer-last-name">Last name</label>
                    <input id="buyer-last-name" name="lastName" type="text" autoComplete="family-name" required />
                  </div>
                  <div className="address-field address-field-wide">
                    <label htmlFor="buyer-street">Address</label>
                    <input id="buyer-street" name="street" type="text" autoComplete="street-address" placeholder="House number, street or landmark" required />
                  </div>
                  <div className="address-field">
                    <label htmlFor="buyer-city">Village / City</label>
                    <input id="buyer-city" name="city" type="text" autoComplete="address-level2" required />
                  </div>
                  <div className="address-field">
                    <label htmlFor="buyer-pincode">PIN code</label>
                    <input id="buyer-pincode" name="postalCode" type="text" inputMode="numeric" autoComplete="postal-code" placeholder="6-digit PIN" pattern="[0-9]{6}" maxLength={6} required />
                  </div>
                  <div className="address-field address-field-wide">
                    <label htmlFor="buyer-phone">Phone number</label>
                    <input id="buyer-phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number" pattern="[0-9]{10}" maxLength={10} required />
                  </div>
                </fieldset>

                <fieldset className="checkout-section payment-panel">
                  <legend>Payment method</legend>
                  <label className={`payment-option ${paymentMethod === "cod" ? "is-selected" : ""}`}>
                    <input type="radio" name="payment-method" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                    <span className="payment-option-copy">
                      <strong>Cash on delivery</strong>
                      <small>Pay when your fresh produce arrives</small>
                    </span>
                    <span className="payment-badge">COD</span>
                  </label>
                  <label className={`payment-option ${paymentMethod === "online" ? "is-selected" : ""}`}>
                    <input type="radio" name="payment-method" value="online" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} />
                    <span className="payment-option-copy">
                      <strong>Secure online payment</strong>
                      <small>Pay with UPI, PhonePe, or a bank card</small>
                    </span>
                    <span className="payment-badge">UPI</span>
                  </label>
                  {paymentMethod === "online" ? (
                    <div className="online-payment-options" aria-label="Choose online payment service">
                      {([['phonepe', 'PhonePe'], ['upi', 'Other UPI app'], ['card', 'Debit / credit card']] as const).map(([value, label]) => (
                        <label key={value} className={onlinePaymentMethod === value ? "is-selected" : ""}>
                          <input type="radio" name="online-payment-method" value={value} checked={onlinePaymentMethod === value} onChange={() => setOnlinePaymentMethod(value)} />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  ) : null}
                </fieldset>
              </div>

              <aside className="checkout-summary" aria-labelledby="order-summary-title">
                <h3 id="order-summary-title">Order summary</h3>
                <div className="checkout-summary-items">
                  {buyerProducts.map((item) => (
                    <div className="checkout-summary-item" key={item.key}>
                      <img src={item.image} alt="" />
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.quantity} &times; {item.price}</span>
                      </div>
                      <strong>Rs {priceValue(item.price) * item.quantity}</strong>
                    </div>
                  ))}
                </div>
                <div className="checkout-total-row"><span>Subtotal</span><strong>Rs {cartTotal}</strong></div>
                <div className="checkout-total-row"><span>Delivery</span><strong className="free-delivery">Free</strong></div>
                <div className="checkout-grand-total"><span>Total</span><strong>Rs {cartTotal}</strong></div>
                <button className="primary-button checkout-pay-button" type="submit">
                  {paymentMethod === "cod" ? `Place order - Rs ${cartTotal}` : `Pay Rs ${cartTotal}`}
                </button>
                <p className="payment-note">
                  {paymentMethod === "cod" ? "Payment will be collected on delivery." : "Your payment will be completed through secure checkout."}
                </p>
              </aside>
            </form>
          </section>
        </div>
      ) : null}
    </main>
  );
}
