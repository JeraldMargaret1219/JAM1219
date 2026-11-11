import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, peso } from "./api";
import { useStore } from "./store.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { authed, refreshCart } = useStore();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/products/${id}/`, { auth: false }).then(setP).catch((e) => setError(e.message));
  }, [id]);

  const add = async (goToCart) => {
    if (!authed) return nav("/login");
    setMsg(""); setError("");
    try {
      await api("/cart/add/", { method: "POST", body: { product: p.id, quantity: qty } });
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
            <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">−</button>
            <input value={qty} readOnly aria-label="Quantity" />
            <button onClick={() => setQty(Math.min(p.stock, qty + 1))} aria-label="Increase">+</button>
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
