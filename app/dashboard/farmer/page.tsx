"use client";

import { useEffect, useState } from "react";

type FarmProduct = {
  id: string;
  name: string;
  type: "Vegetable" | "Fruit";
  price: string;
  stock: string;
  image: string;
};

type FarmerView = "products" | "stock" | "orders" | "wallet";
type OrderStatus = "Confirm" | "Packing" | "Out for delivery";

const farmerViews: { key: FarmerView; label: string; description: string }[] = [
  { key: "products", label: "Products", description: "Add and manage produce" },
  { key: "stock", label: "Stock preview", description: "Review live quantity" },
  { key: "orders", label: "Today's orders", description: "Track buyer demand" },
  { key: "wallet", label: "Farmer wallet", description: "View balance and add money" },
];

const todaysOrders = [
  { id: "#KH-2041", buyer: "Fresh Basket", item: "Tomato", quantity: "420 kg", amount: "Rs 11,760", status: "Confirm" as OrderStatus },
  { id: "#KH-2042", buyer: "Green Mart", item: "Mango", quantity: "260 kg", amount: "Rs 23,400", status: "Packing" as OrderStatus },
  { id: "#KH-2043", buyer: "City Foods", item: "Potato", quantity: "900 kg", amount: "Rs 16,200", status: "Out for delivery" as OrderStatus },
  { id: "#KH-2044", buyer: "Daily Bazaar", item: "Spinach", quantity: "180 bunches", amount: "Rs 3,240", status: "Confirm" as OrderStatus },
];

const orderStatuses: OrderStatus[] = ["Confirm", "Packing", "Out for delivery"];

const starterProducts: FarmProduct[] = [
  {
    id: "seed-tomato",
    name: "Tomato",
    type: "Vegetable",
    price: "Rs 28/kg",
    stock: "3.4 t available",
    image: "/produce/items/tomato.png",
  },
  {
    id: "seed-mango",
    name: "Mango",
    type: "Fruit",
    price: "Rs 90/kg",
    stock: "2.6 t available",
    image: "/produce/items/mango.png",
  },
];

function readImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function FarmerDashboard() {
  const [products, setProducts] = useState<FarmProduct[]>(starterProducts);
  const [preview, setPreview] = useState("");
  const [activeView, setActiveView] = useState<FarmerView>("products");
  const [walletBalance, setWalletBalance] = useState(12500);
  const [orders, setOrders] = useState(todaysOrders);
  const pendingPayments = 6840;
  const totalEarnings = 82750;
  const withdrawableAmount = Math.max(walletBalance - 1500, 0);

  useEffect(() => {
    const savedProducts = window.localStorage.getItem("farmer-products");

    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts) as unknown;
        if (Array.isArray(parsedProducts)) {
          setProducts(parsedProducts as FarmProduct[]);
        }
      } catch {
        window.localStorage.removeItem("farmer-products");
      }
    }

    const savedBalance = window.localStorage.getItem("farmer-wallet-balance");
    if (savedBalance) {
      const parsedBalance = Number(savedBalance);
      if (Number.isFinite(parsedBalance) && parsedBalance >= 0) {
        setWalletBalance(parsedBalance);
      } else {
        window.localStorage.removeItem("farmer-wallet-balance");
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("farmer-products", JSON.stringify(products));
  }, [products]);

  return (
    <main className="dashboard-page">
      <aside className="dashboard-sidebar">
        <a className="brand dashboard-brand" href="/" aria-label="Krishi Hub home">
          <span className="brand-mark">KH</span>
          <span>Krishi Hub</span>
        </a>

        <nav className="dashboard-nav" aria-label="Farmer navigation">
          <a className="active" href="/dashboard/farmer">Farmer dashboard</a>
          <a href="/dashboard/buyer">Buyer dashboard</a>
          <a href="/">Logout</a>
        </nav>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Farmer workspace</p>
            <h1>Farmer product dashboard</h1>
            <p>
              Upload vegetables and fruits with clear photos, pricing, and stock
              details so buyers can review fresh farm produce.
            </p>
          </div>

          <div className="dashboard-header-actions">
            <a className="primary-button dashboard-action" href="/dashboard/buyer">
              View cart
            </a>
            <a className="secondary-button dashboard-action" href="/">
              Back to home
            </a>
          </div>
        </header>

        <section className="farmer-console">
          <section className="farmer-view-nav" aria-label="Farmer dashboard sections">
            {farmerViews.map((view) => (
              <button
                className={activeView === view.key ? "active" : ""}
                key={view.key}
                type="button"
                onClick={() => setActiveView(view.key)}
              >
                <strong>{view.label}</strong>
                <span>{view.description}</span>
              </button>
            ))}
          </section>

          {activeView === "products" ? (
        <div className="farmer-workspace">
          <article className="dashboard-card farmer-upload-card" aria-labelledby="upload-title">
            <div className="card-header">
              <div>
                <h2 id="upload-title">Add product</h2>
                <p>Upload a vegetable or fruit with image, price, and stock.</p>
              </div>
            </div>

            <form
              className="farmer-product-form"
              onSubmit={async (event) => {
                event.preventDefault();
                const form = event.currentTarget;
                const formData = new FormData(form);
                const imageFile = formData.get("image");

                if (!(imageFile instanceof File) || imageFile.size === 0) {
                  return;
                }

                const image = await readImage(imageFile);
                const nextProduct: FarmProduct = {
                  id: `${Date.now()}`,
                  name: String(formData.get("name") ?? ""),
                  type: String(formData.get("type")) === "Fruit" ? "Fruit" : "Vegetable",
                  price: String(formData.get("price") ?? ""),
                  stock: String(formData.get("stock") ?? ""),
                  image,
                };

                setProducts((current) => [nextProduct, ...current]);
                setPreview("");
                form.reset();
              }}
            >
              <label>
                Product name
                <input name="name" type="text" placeholder="Potato" required />
              </label>

              <label>
                Product type
                <select name="type" defaultValue="Vegetable" required>
                  <option value="Vegetable">Vegetable</option>
                  <option value="Fruit">Fruit</option>
                </select>
              </label>

              <label>
                Price
                <input name="price" type="text" placeholder="Rs 28/kg" required />
              </label>

              <label>
                Stock
                <input name="stock" type="text" placeholder="500 kg available" required />
              </label>

              <label className="farmer-image-field">
                Product image
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  required
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    setPreview(file ? await readImage(file) : "");
                  }}
                />
              </label>

              {preview ? (
                <img className="farmer-image-preview" src={preview} alt="Selected product preview" />
              ) : (
                <div className="farmer-image-placeholder">Image preview</div>
              )}

              <button className="primary-button" type="submit">
                Publish product
              </button>
            </form>
          </article>

          <article className="dashboard-card farmer-products-card">
            <div className="card-header">
              <div>
                <h2>My products</h2>
                <p>Vegetables and fruits uploaded by the farmer.</p>
              </div>
              <span className="status-pill">{products.length} listed</span>
            </div>

            <div className="farmer-product-grid">
              {products.map((product) => (
                <article className="produce-card farmer-product-card" key={product.id}>
                  <img className="produce-photo" src={product.image} alt={product.name} />
                  <span className="produce-card-copy">
                    <span className="produce-name">{product.name}</span>
                    <span className="produce-stock">{product.type} · {product.stock}</span>
                    <span className="produce-price">{product.price}</span>
                  </span>
                </article>
              ))}
            </div>
          </article>
        </div>
          ) : null}

          {activeView === "stock" ? (
            <article className="dashboard-card farmer-panel-card">
              <div className="card-header">
                <div>
                  <h2>Stock preview</h2>
                  <p>Current vegetables and fruits available from your farm.</p>
                </div>
                <span className="status-pill">{products.length} products</span>
              </div>

              <div className="farmer-stock-list">
                {products.map((product) => (
                  <div className="farmer-stock-row" key={product.id}>
                    <img src={product.image} alt={product.name} />
                    <div>
                      <strong>{product.name}</strong>
                      <span>{product.type}</span>
                    </div>
                    <div>
                      <strong>{product.stock}</strong>
                      <span>Available stock</span>
                    </div>
                    <div>
                      <strong>{product.price}</strong>
                      <span>Listed price</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ) : null}

          {activeView === "orders" ? (
            <article className="dashboard-card farmer-panel-card">
              <div className="card-header">
                <div>
                  <h2>Today's orders</h2>
                  <p>Buyer orders received today for your listed produce.</p>
                </div>
                <span className="status-pill">{orders.length} orders</span>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Buyer</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.buyer}</td>
                        <td>{order.item}</td>
                        <td>{order.quantity}</td>
                        <td>{order.amount}</td>
                        <td>
                          <select
                            className="order-status-select"
                            value={order.status}
                            aria-label={`Update status for order ${order.id}`}
                            onChange={(event) => {
                              const status = event.target.value as OrderStatus;
                              setOrders((currentOrders) =>
                                currentOrders.map((currentOrder) =>
                                  currentOrder.id === order.id
                                    ? { ...currentOrder, status }
                                    : currentOrder,
                                ),
                              );
                            }}
                          >
                            {orderStatuses.map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          ) : null}

          {activeView === "wallet" ? (
            <article className="dashboard-card farmer-panel-card farmer-wallet-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Farmer wallet</p>
                  <h2>Wallet balance</h2>
                  <p>Manage funds for farm supplies, delivery, and marketplace payments.</p>
                </div>
                <span className="status-pill">Active</span>
              </div>

              <div className="farmer-wallet-layout">
                <section className="wallet-metrics-grid" aria-label="Farmer wallet overview">
                  <article className="wallet-balance-panel wallet-metric-featured">
                    <span>Current available balance</span>
                    <strong>Rs {walletBalance.toLocaleString("en-IN")}</strong>
                    <small>Ready to use in your farmer account</small>
                  </article>

                  <article className="wallet-metric-card wallet-metric-pending">
                    <span>Pending payments</span>
                    <strong>Rs {pendingPayments.toLocaleString("en-IN")}</strong>
                    <small>Expected from active orders</small>
                  </article>

                  <article className="wallet-metric-card wallet-metric-earnings">
                    <span>Total earnings</span>
                    <strong>Rs {totalEarnings.toLocaleString("en-IN")}</strong>
                    <small>Lifetime marketplace earnings</small>
                  </article>

                  <article className="wallet-metric-card wallet-metric-withdrawable">
                    <span>Withdrawable amount</span>
                    <strong>Rs {withdrawableAmount.toLocaleString("en-IN")}</strong>
                    <small>Available after the minimum reserve</small>
                  </article>
                </section>

                <form
                  className="wallet-add-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const form = event.currentTarget;
                    const amount = Number(new FormData(form).get("amount"));
                    if (!Number.isFinite(amount) || amount <= 0) return;

                    const nextBalance = walletBalance + amount;
                    setWalletBalance(nextBalance);
                    window.localStorage.setItem("farmer-wallet-balance", String(nextBalance));
                    form.reset();
                  }}
                >
                  <div>
                    <h3>Add money</h3>
                    <p>Enter an amount to add to your farmer wallet.</p>
                  </div>
                  <label htmlFor="wallet-amount">Amount</label>
                  <div className="wallet-amount-field">
                    <span>Rs</span>
                    <input
                      id="wallet-amount"
                      name="amount"
                      type="number"
                      min="1"
                      step="1"
                      inputMode="numeric"
                      placeholder="500"
                      required
                    />
                  </div>
                  <button className="primary-button" type="submit">Add money</button>
                </form>
              </div>
            </article>
          ) : null}
        </section>
      </section>
    </main>
  );
}
