import { Link } from "react-router-dom";
import { peso } from "./api";

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="card">
      {product.thumbnail ? (
        <img src={product.thumbnail} alt="" className="thumb" />
      ) : (
        <div className="thumb thumb-empty">No image</div>
      )}
      <div className="card-body">
        <p className="card-name">{product.name}</p>
        <div className="card-foot">
          <span className="price">{peso(product.price)}</span>
          <span className="stock">{product.stock > 0 ? `${product.stock} left` : "Sold out"}</span>
        </div>
      </div>
    </Link>
  );
}
