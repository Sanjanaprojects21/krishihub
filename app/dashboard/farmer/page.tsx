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

type FarmerView = "products" | "stock" | "orders";

const farmerViews: { key: FarmerView; label: string; description: string }[] = [
  { key: "products", label: "Products", description: "Add and manage produce" },
  { key: "stock", label: "Stock preview", description: "Review live quantity" },
  { key: "orders", label: "Today's orders", description: "Track buyer demand" },
];

const todaysOrders = [
  { id: "#KH-2041", buyer: "Fresh Basket", item: "Tomato", quantity: "420 kg", amount: "Rs 11,760", status: "Confirmed" },
  { id: "#KH-2042", buyer: "Green Mart", item: "Mango", quantity: "260 kg", amount: "Rs 23,400", status: "Packing" },
  { id: "#KH-2043", buyer: "City Foods", item: "Potato", quantity: "900 kg", amount: "Rs 16,200", status: "Pickup due" },
  { id: "#KH-2044", buyer: "Daily Bazaar", item: "Spinach", quantity: "180 bunches", amount: "Rs 3,240", status: "New" },
];

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

  useEffect(() => {
    const savedProducts = window.localStorage.getItem("farmer-products");

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts) as FarmProduct[]);
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

          <a className="primary-button dashboard-action" href="/dashboard/buyer">
            View market
          </a>
        </header>

        <section className="farmer-console">
          <aside className="farmer-view-nav" aria-label="Farmer dashboard sections">
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
          </aside>

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
                <span className="status-pill">{todaysOrders.length} orders</span>
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
                    {todaysOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.buyer}</td>
                        <td>{order.item}</td>
                        <td>{order.quantity}</td>
                        <td>{order.amount}</td>
                        <td>
                          <span className="status-pill">{order.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          ) : null}
        </section>
      </section>
    </main>
  );
}
