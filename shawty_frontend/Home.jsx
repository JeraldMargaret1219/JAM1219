import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "./api";
import ProductCard from "./ProductCard.jsx";

export default function Home() {
  const [params] = useSearchParams();
  const q = params.get("search") || "";
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setProducts(null);
    api(`/products/?search=${encodeURIComponent(q)}`, { auth: false })
      .then((d) => setProducts(Array.isArray(d) ? d : d.results))
      .catch((e) => setError(e.message));
  }, [q]);

  return (
    <>
      {!q && (
        <section className="banner">
          <h1>Shop more, pay less.</h1>
          <p>Everything you need, delivered to your door.</p>
        </section>
      )}
      <h2 className="section-title">{q ? `Results for “${q}”` : "Products for you"}</h2>
      {error && <p className="error">Couldn’t load products: {error}</p>}
      {!products && !error && <p className="muted">Loading products…</p>}
      {products && products.length === 0 && (
        <p className="muted">No products found. Try a different search.</p>
      )}
      <div className="grid">
        {products?.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  );
}
