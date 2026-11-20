import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, peso } from "./api";
import { useStore } from "./store.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { authed, refreshCart } = useStore();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState("1"); // string so the field can be typed in freely
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/products/${id}/`, { auth: false }).then(setP).catch((e) => setError(e.message));
  }, [id]);

  // typed text -> a valid number between 1 and stock
  const safeQty = () => {
    const n = parseInt(qty, 10);
    if (Number.isNaN(n) || n < 1) return 1;
    return p ? Math.min(n, p.stock) : n;
  };

  const add = async (goToCart) => {
    if (!authed) return nav("/login");
    setMsg(""); setError("");
    const quantity = safeQty();
    setQty(String(quantity)); // show the corrected number
    try {
      await api("/cart/add/", { method: "POST", body: { product: p.id, quantity } });
      await refreshCart();
      if (goToCart) nav("/cart");
      else setMsg("Added to cart.");
    } catch (e) { setError(e.message); }
  };

  if (error && !p) return <p className="error">{error}</p>;
  if (!p) return <p className="muted">Loading…</p>;

  return (
    <div className="panel detail">
      {p.thumbnail ? <img className="detail-img" src={p.thumbnail} alt={p.name} /> : <div className="detail-img thumb-empty">No image</div>}
      <div>
        <h1 className="detail-name">{p.name}</h1>
        <div className="price-box"><span className="price big">{peso(p.price)}</span></div>
        <p className="muted">SKU: {p.sku}</p>
        <div className="qty-row">
          <span>Quantity</span>
          <div className="qty">
            <button onClick={() => setQty(String(Math.max(1, safeQty() - 1)))} aria-label="Decrease">−</button>
            <input
              type="number"
              min="1"
              max={p.stock}
              step="1"
              inputMode="numeric"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              onBlur={() => setQty(String(safeQty()))}
              onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
              aria-label="Quantity"
              className="w-16 text-center border border-gray-300 rounded px-2 py-1 pointer-events-auto select-text cursor-text focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button onClick={() => setQty(String(Math.min(p.stock, safeQty() + 1)))} aria-label="Increase">+</button>
          </div>
          <span className="muted">{p.stock} available</span>
        </div>
        <div className="actions">
          <button className="btn btn-outline" disabled={p.stock < 1} onClick={() => add(false)}>Add to cart</button>
          <button className="btn btn-solid" disabled={p.stock < 1} onClick={() => add(true)}>Buy now</button>
        </div>
        {msg && <p className="ok">{msg}</p>}
        {error && <p className="error">{error}</p>}
        <h3>Product description</h3>
        <p className="desc">{p.description || "No description provided."}</p>
      </div>
    </div>
  );
}