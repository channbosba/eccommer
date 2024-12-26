import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { setCartItems } = useCart();

  const handleAddToCart = () => {
    const newProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity,
    };

    setCartItems((prev) => [...prev, newProduct]);
    alert(`${product.title} added to your cart`);
  };

  const handleBuyNow = (event) => {
    event.preventDefault();
    if (product) {
      const newProduct = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity,
      };
      setCartItems((prev) => [...prev, newProduct]);
      navigate('/checkout', { state: { product: newProduct } });
    }
  };

  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === 'increase' ? Math.min(prev + 1, 100) : Math.max(prev - 1, 1)
    );
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 mb-5">
            <img src={product.image} className="img-fluid" alt={product.title} />
          </div>
          <div className="col-lg-6 product-details pl-md-5 text py-3 pb-4 px-3">
            <h3>{product.title}</h3>
            <p className="price"><span>${product.price}</span></p>
            <p>{product.description}</p>
            <div className="row mt-4">
              <div className="input-group col-md-6 d-flex mb-3">
                <button
                  type="button"
                  className="quantity-left-minus btn"
                  onClick={() => handleQuantityChange('decrease')}
                >
                  <i className="ion-ios-remove"></i>
                </button>
                <input
                  type="text"
                  className="quantity form-control input-number"
                  value={quantity}
                  readOnly
                />
                <button
                  type="button"
                  className="quantity-right-plus btn"
                  onClick={() => handleQuantityChange('increase')}
                >
                  <i className="ion-ios-add"></i>
                </button>
              </div>
              <p style={{ color: '#000' }}>80 pieces available</p>
            </div>
            <p className="bottom-area d-flex px-3">
              <button onClick={handleAddToCart} className="py-3 px-5 mr-2">
                Add to Cart
              </button>
              <button onClick={handleBuyNow} className="py-3 px-5">
                Buy Now
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
