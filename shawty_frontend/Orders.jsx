import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, peso } from "./api";
import { useStore } from "./store.jsx";

export default function Orders() {
  const { authed } = useStore();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authed) return;
    api("/transactions/").then((d) => setOrders(Array.isArray(d) ? d : d.results)).catch((e) => setError(e.message));
  }, [authed]);

  if (!authed) return <p className="panel">Please <Link to="/login">log in</Link> to see your purchases.</p>;
  if (error) return <p className="error">{error}</p>;
  if (!orders) return <p className="muted">Loading…</p>;
  if (orders.length === 0) return <div className="panel empty"><p>No purchases yet.</p><Link className="btn btn-solid" to="/">Start shopping</Link></div>;

  return orders.map((o) => {
    const total = o.product_transactions.reduce((s, pt) => s + pt.quantity * Number(pt.item_detail.price), 0);
    return (
      <div className="panel order" key={o.id}>
        <div className="order-head">
          <span className="muted">Ordered {new Date(o.created_at).toLocaleString("en-PH")}</span>
        </div>
        {o.product_transactions.map((pt) => (
          <div className="order-row" key={pt.id}>
            <Link to={`/product/${pt.item}`}>{pt.item_detail.name}</Link>
            <span className="muted">x{pt.quantity}</span>
            <span className="price">{peso(pt.item_detail.price)}</span>
          </div>
        ))}
        <div className="order-total">Order total: <span className="price big">{peso(total)}</span></div>
      </div>
    );
  });
}
