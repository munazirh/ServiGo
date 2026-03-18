import React from "react";
import "./components.css";

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-info">
        <h4>{product.name}</h4>
        <p>{product.description}</p>
        <h5>₹ {product.price}</h5>
        <button className="buy-btn">Add to Cart</button>
      </div>
    </div>
  );
}

export default ProductCard;
