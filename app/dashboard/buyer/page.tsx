"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProduceItem } from "../../../lib/produce-catalog";

type BuyerProduct = ProduceItem & {
  quantity: number;
};

function priceValue(price: string) {
  const match = price.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export default function ProducePage() {
  const [items, setItems] = useState<ProduceItem[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ProduceItem | null>(null);
  const [buyerProducts, setBuyerProducts] = useState<BuyerProduct[]>([]);
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
  const isActiveItemAdded = activeItem ? buyerProducts.some((item) => item.key === activeItem.key) : false;
  const buyerName = "Buyer";
  const cartTotal = buyerProducts.reduce((total, item) => total + priceValue(item.price) * item.quantity, 0);

  if (loading) {
    return (
      <main className="produce-page">
        <div className="produce-loading">Loading vegetables and fruits...</div>
      </main>
    );
  }

  return (
    <main className="produce-page">
      <header className="produce-header">
        <a className="brand" href="/" aria-label="Krishi Hub home">
          <span className="brand-mark">KH</span>
          <span>Krishi Hub</span>
        </a>

        <div className="produce-title">
          <p className="eyebrow">Fresh marketplace</p>
          <h1>Vegetables and fruits</h1>
          <p>Browse vegetables and fruits with their names, images, prices, and available stock.</p>
        </div>

        <a className="secondary-button produce-back" href="/">
          Back to login
        </a>
      </header>

      <section className="produce-search-panel" aria-label="Search produce">
        <label htmlFor="produce-search">Search vegetables or fruits</label>
        <input
          id="produce-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search cauliflower, tomato, mango, apple..."
        />
      </section>

      {error ? <p className="empty-result">{error}</p> : null}

      <section className="buyer-dashboard-layout">
        <div className="buyer-market-main">
          {activeItem && !error && (
            <section className="produce-feature" aria-live="polite">
              <img className="produce-photo feature-photo" src={activeItem.image} alt={activeItem.name} />
              <div>
                <span>{activeItem.type}</span>
                <h2>{activeItem.name}</h2>
                <strong>{activeItem.price}</strong>
                <button
                  className="primary-button add-product-button"
                  type="button"
                  disabled={isActiveItemAdded}
                  onClick={() => {
                    setBuyerProducts((current) =>
                      current.some((item) => item.key === activeItem.key)
                        ? current
                        : [{ ...activeItem, quantity: 1 }, ...current],
                    );
                  }}
                >
                  {isActiveItemAdded ? "Added to cart" : "Add cart"}
                </button>
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
                {filteredProduce.map((item) => (
                  <button
                    className="produce-card"
                    type="button"
                    key={item.key}
                    onClick={() => setSelected(item)}
                  >
                    <img className="produce-photo" src={item.image} alt={item.name} loading="lazy" />
                    <span className="produce-card-copy">
                      <span className="produce-name">{item.name}</span>
                      <span className="produce-stock">{item.type}</span>
                      <span className="produce-price">{item.price}</span>
                    </span>
                  </button>
                ))}
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
                  {vegetables.map((item) => (
                    <button
                      className="produce-card"
                      type="button"
                      key={item.key}
                      onClick={() => setSelected(item)}
                    >
                      <img className="produce-photo" src={item.image} alt={item.name} loading="lazy" />
                      <span className="produce-card-copy">
                        <span className="produce-name">{item.name}</span>
                        <span className="produce-stock">{item.stock}</span>
                        <span className="produce-price">{item.price}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="produce-section" aria-labelledby="fruits-title">
                <div className="section-heading">
                  <h2 id="fruits-title">Fruits</h2>
                  <span>{fruits.length} items</span>
                </div>

                <div className="produce-grid">
                  {fruits.map((item) => (
                    <button
                      className="produce-card"
                      type="button"
                      key={item.key}
                      onClick={() => setSelected(item)}
                    >
                      <img className="produce-photo" src={item.image} alt={item.name} loading="lazy" />
                      <span className="produce-card-copy">
                        <span className="produce-name">{item.name}</span>
                        <span className="produce-stock">{item.stock}</span>
                        <span className="produce-price">{item.price}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            </>
          ) : null}
        </div>

        <aside className="buyer-product-sidebar" aria-labelledby="buyer-products-title">
          <div className="buyer-sidebar-header">
            <div>
              <p className="eyebrow">Buyer cart</p>
              <h2 id="buyer-products-title">Add cart</h2>
            </div>
            <span>{buyerProducts.length}</span>
          </div>

          <div className="buyer-sidebar-user">
            <span>Username</span>
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
                      onClick={() => {
                        setBuyerProducts((current) =>
                          current
                            .map((product) =>
                              product.key === item.key
                                ? { ...product, quantity: product.quantity - 1 }
                                : product,
                            )
                            .filter((product) => product.quantity > 0),
                        );
                      }}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setBuyerProducts((current) =>
                          current.map((product) =>
                            product.key === item.key
                              ? { ...product, quantity: product.quantity + 1 }
                              : product,
                          ),
                        );
                      }}
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
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
