import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, peso } from "./api";
import { useStore } from "./store.jsx";

export default function Cart() {
  const { authed, cart, setCart, refreshCart } = useStore();
  const nav = useNavigate();
  const [error, setError] = useState("");

  if (!authed) return <p className="panel">Please <Link to="/login">log in</Link> to see your cart.</p>;

  const items = cart.cart_products;
  const total = items.reduce((s, i) => s + i.quantity * Number(i.product_detail.price), 0);

  const setQty = async (item, quantity) => {
    try {
      setCart(await api("/cart/set_quantity/", { method: "POST", body: { product: item.product, quantity } }));
    } catch (e) { setError(e.message); }
  };

  const checkout = async () => {
    setError("");
    try {
      await api("/cart/checkout/", { method: "POST" });
      await refreshCart();
      nav("/orders");
    } catch (e) { setError(e.message); }
  };

  if (items.length === 0)
    return <div className="panel empty"><p>Your cart is empty.</p><Link className="btn btn-solid" to="/">Start shopping</Link></div>;

  return (
    <>
      <div className="panel">
        {items.map((i) => (
          <div className="cart-row" key={i.id}>
            <Link to={`/product/${i.product}`} className="cart-name">{i.product_detail.name}</Link>
            <span className="price">{peso(i.product_detail.price)}</span>
            <div className="qty">
              <button onClick={() => setQty(i, i.quantity - 1)} aria-label="Decrease">−</button>
              <input value={i.quantity} readOnly aria-label="Quantity" />
              <button onClick={() => setQty(i, i.quantity + 1)} aria-label="Increase">+</button>
            </div>
            <span className="price">{peso(i.quantity * i.product_detail.price)}</span>
            <button className="link-btn dark" onClick={() => setQty(i, 0)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="panel checkout-bar">
        {error && <span className="error">{error}</span>}
        <span>Total: <span className="price big">{peso(total)}</span></span>
        <button className="btn btn-solid" onClick={checkout}>Check out</button>
      </div>
    </>
  );
}
