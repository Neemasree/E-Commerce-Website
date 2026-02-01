import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const heroSlides = [
    {
      title: "Fresh Vegetables Daily",
      subtitle: "Farm fresh vegetables delivered to your doorstep",
      image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      title: "Premium Dairy Products",
      subtitle: "Pure and nutritious dairy products for your family",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  useEffect(() => {
    fetchFeaturedProducts();
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const products = await getProducts();
      setFeaturedProducts(products.slice(0, 8));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-slider">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <div className="container">
                <div className="hero-content">
                  <div className="hero-text">
                    <h1 className="hero-title">{slide.title}</h1>
                    <p className="hero-subtitle">{slide.subtitle}</p>
                    <Link to="/products" className="btn btn-hero">
                      Shop Now
                    </Link>
                  </div>
                  <div className="hero-image">
                    {/* Image is now used as background */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="hero-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            <Link to="/products?category=vegetables" className="category-card vegetables">
              <div className="category-icon">🥕</div>
              <h3>Fresh Vegetables</h3>
              <p>Farm fresh & organic</p>
            </Link>
            <Link to="/products?category=dairy" className="category-card dairy">
              <div className="category-icon">🧀</div>
              <h3>Dairy Products</h3>
              <p>Pure & nutritious</p>
            </Link>
            <Link to="/products?category=fruits" className="category-card fruits">
              <div className="category-icon">🍎</div>
              <h3>Fresh Fruits</h3>
              <p>Sweet & juicy</p>
            </Link>
            <Link to="/products?category=grains" className="category-card grains">
              <div className="category-icon">🌾</div>
              <h3>Grains & Cereals</h3>
              <p>Healthy & wholesome</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-4">
            <Link to="/products" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Free Delivery</h3>
              <p>Free delivery on orders above ₹500</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Fresh & Organic</h3>
              <p>100% fresh and organic products</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Competitive prices with great offers</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Quality Assured</h3>
              <p>Premium quality guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home {
          min-height: 100vh;
        }

        .hero {
          position: relative;
          height: 70vh;
          overflow: hidden;
        }

        .hero-slider {
          position: relative;
          height: 100%;
        }

        .hero-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transform: translateX(100%);
          transition: all 0.8s ease-in-out;
          display: flex;
          align-items: center;
        }

        .hero-slide.active {
          opacity: 1;
          transform: translateX(0);
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 2rem;
          height: 100%;
        }

        .hero-text {
          color: white;
          animation: fadeIn 1s ease-out 0.5s both;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: 1.3rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .btn-hero {
          background: white;
          color: #333;
          padding: 15px 30px;
          font-size: 1.1rem;
          font-weight: bold;
          border-radius: 50px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .btn-hero:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }

        .hero-image {
          text-align: center;
          animation: fadeIn 1s ease-out 0.8s both;
        }

        .hero-emoji {
          font-size: 15rem;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .hero-indicators {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 1rem;
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: white;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 3rem;
          color: #333;
          position: relative;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: #007bff;
          border-radius: 2px;
        }

        .categories {
          padding: 5rem 0;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          position: relative;
          overflow: hidden;
        }

        .categories::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="%23e9ecef" opacity="0.3"/><circle cx="80" cy="80" r="2" fill="%23e9ecef" opacity="0.3"/><circle cx="50" cy="50" r="3" fill="%23e9ecef" opacity="0.2"/></svg>');
          animation: float 20s ease-in-out infinite;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .category-card {
          background: white;
          padding: 1.2rem 0.8rem;
          border-radius: 12px;
          text-align: center;
          text-decoration: none;
          color: #333;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          animation: slideUp 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(15px);
          border: 1px solid #e0e0e0;
          cursor: pointer;
        }

        .category-card.vegetables {
          background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
        }

        .category-card.dairy {
          background: linear-gradient(135deg, #fff3e0 0%, #fff8e1 100%);
        }

        .category-card.fruits {
          background: linear-gradient(135deg, #fce4ec 0%, #fce4ec 100%);
        }

        .category-card.grains {
          background: linear-gradient(135deg, #f3e5f5 0%, #f3e5f5 100%);
        }

        .category-card:nth-child(1) { animation-delay: 0.1s; }
        .category-card:nth-child(2) { animation-delay: 0.2s; }
        .category-card:nth-child(3) { animation-delay: 0.3s; }
        .category-card:nth-child(4) { animation-delay: 0.4s; }

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .category-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #84c225, #5ca013);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .category-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(132, 194, 37, 0.1), rgba(92, 160, 19, 0.05));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .category-card:hover {
          transform: translateY(-15px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .category-card:hover::before {
          transform: scaleX(1);
        }

        .category-card:hover::after {
          opacity: 1;
        }

        .category-icon {
          font-size: 2.5rem;
          margin-bottom: 0.8rem;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .category-card:hover .category-icon {
          transform: scale(1.05);
        }

        .category-card h3 {
          font-size: 1.1rem;
          margin-bottom: 0.2rem;
          color: #333;
          font-weight: 600;
          position: relative;
          z-index: 1;
          transition: color 0.3s ease;
        }

        .category-card:hover h3 {
          color: #1976d2;
        }

        .category-card p {
          color: #666;
          font-size: 0.8rem;
          position: relative;
          z-index: 1;
          transition: color 0.3s ease;
        }

        .category-card:hover p {
          color: #424242;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }

        .featured-products {
          padding: 5rem 0;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .features {
          padding: 5rem 0;
          background: #f8f8f8;
          color: #333;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          border: 1px solid #e8e8e8;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
        }

        .feature-card p {
          color: #666;
        }

        @media (max-width: 768px) {
          .hero {
            height: 60vh;
          }

          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 1rem;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .hero-emoji {
            font-size: 8rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .categories-grid,
          .features-grid {
            grid-template-columns: 1fr;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-emoji {
            font-size: 6rem;
          }

          .category-card,
          .feature-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;