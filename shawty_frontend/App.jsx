import { Routes, Route, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useStore } from "./store.jsx";
import Home from "./Home.jsx";
import ProductDetail from "./ProductDetail.jsx";
import Cart from "./Cart.jsx";
import Orders from "./Orders.jsx";
import Auth from "./Auth.jsx";

function Header() {
  const { authed, logout, cartCount } = useStore();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("search") || "");
  const nav = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    nav(q ? `/?search=${encodeURIComponent(q)}` : "/");
  };
  return (
    <header className="header">
      <div className="container header-row">
        <Link to="/" className="logo">Shawty</Link>
        <form className="search" onSubmit={submit}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" aria-label="Search products" />
          <button aria-label="Search">Search</button>
        </form>
        <nav className="nav">
          {authed ? (
            <>
              <Link to="/orders">My budols</Link>
              <button className="link-btn" onClick={logout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/register">Sign up</Link>
              <Link to="/login">Log in</Link>
            </>
          )}
          <Link to="/cart" className="cart-link" aria-label={`Cart, ${cartCount} items`}>
            Cart{cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main className="container page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
        </Routes>
      </main>
    </>
  );
}
