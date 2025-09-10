import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [message, setMessage] = useState('')

  // Sample product images - in a real app, these would come from your backend
  const sampleImages = {
    1: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    2: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    3: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    4: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
    5: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop',
    default: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop'
  }

  // Enhanced product descriptions
  const enhancedDescriptions = {
    1: {
      fullDescription: "Premium wireless headphones with active noise cancellation technology. Features 30-hour battery life, premium leather padding, and crystal-clear audio quality. Perfect for music lovers, professionals, and travelers who demand the best audio experience.",
      features: ["Active Noise Cancellation", "30-hour battery life", "Premium leather padding", "Bluetooth 5.0", "Quick charge (15 min = 3 hours)"],
      specifications: {
        "Battery Life": "30 hours",
        "Connectivity": "Bluetooth 5.0",
        "Weight": "250g",
        "Charging": "USB-C",
        "Warranty": "2 years"
      }
    },
    2: {
      fullDescription: "Professional running shoes designed for maximum comfort and performance. Engineered with advanced cushioning technology and breathable mesh upper for optimal airflow during intense workouts.",
      features: ["Advanced cushioning", "Breathable mesh upper", "Lightweight design", "Durable rubber sole", "Moisture-wicking interior"],
      specifications: {
        "Weight": "280g",
        "Material": "Mesh & Synthetic",
        "Sole": "Rubber",
        "Sizes": "US 6-13",
        "Warranty": "1 year"
      }
    },
    3: {
      fullDescription: "Elegant wristwatch combining classic design with modern functionality. Features Swiss movement, sapphire crystal glass, and water resistance up to 100 meters. Perfect for both formal and casual occasions.",
      features: ["Swiss movement", "Sapphire crystal", "Water resistant (100m)", "Stainless steel case", "Leather strap"],
      specifications: {
        "Movement": "Swiss Quartz",
        "Case Material": "Stainless Steel",
        "Water Resistance": "100m",
        "Strap": "Genuine Leather",
        "Warranty": "3 years"
      }
    },
    4: {
      fullDescription: "High-performance laptop designed for professionals and creators. Features the latest processor, ample RAM, and a stunning display perfect for work, gaming, and content creation.",
      features: ["Latest generation processor", "16GB RAM", "512GB SSD", "15.6\" 4K display", "All-day battery life"],
      specifications: {
        "Processor": "Intel i7 12th Gen",
        "RAM": "16GB DDR4",
        "Storage": "512GB SSD",
        "Display": "15.6\" 4K IPS",
        "Battery": "10 hours"
      }
    },
    5: {
      fullDescription: "Premium smartphone with advanced camera system and lightning-fast performance. Features multiple lenses, AI-enhanced photography, and all-day battery life in a sleek design.",
      features: ["Triple camera system", "AI photography", "5G connectivity", "Wireless charging", "Face ID & Fingerprint"],
      specifications: {
        "Display": "6.1\" OLED",
        "Storage": "128GB",
        "Camera": "48MP Triple",
        "Battery": "All-day",
        "Connectivity": "5G"
      }
    }
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`)
        setProduct(data)
      } catch (error) {
        console.error('Failed to fetch product:', error)
        // If API fails, create a mock product for demo purposes
        setProduct({
          id: parseInt(id),
          name: `Product ${id}`,
          price: 99.99,
          description: `This is product ${id}`
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const addToCart = async () => {
    setAddingToCart(true)
    setMessage('')
    try {
      // In a real app, you'd make an API call to add to cart
      // For now, we'll just show a success message
      setMessage(`Added ${quantity} ${product.name}(s) to cart!`)
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div>Loading product details...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="card">
        <div>Product not found</div>
        <button className="btn" onClick={() => navigate('/')}>
          Back to Products
        </button>
      </div>
    )
  }

  const productImage = sampleImages[product.id] || sampleImages.default
  const productDetails = enhancedDescriptions[product.id] || {
    fullDescription: product.description || "No description available",
    features: ["Standard features"],
    specifications: {}
  }

  return (
    <div>
      <button 
        className="btn secondary" 
        onClick={() => navigate('/')}
        style={{ marginBottom: 16 }}
      >
        ← Back to Products
      </button>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
          {/* Product Image */}
          <div>
            <img 
              src={productImage} 
              alt={product.name}
              style={{ 
                width: '100%', 
                height: '400px', 
                objectFit: 'cover', 
                borderRadius: '8px',
                border: '1px solid #1c254a'
              }}
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 style={{ margin: '0 0 16px 0', fontSize: '28px' }}>{product.name}</h1>
            <div style={{ fontSize: '24px', fontWeight: 600, color: '#9db2ff', marginBottom: 16 }}>
              ${product.price?.toFixed ? product.price.toFixed(2) : product.price}
            </div>
            
            <p style={{ lineHeight: 1.6, marginBottom: 24, opacity: 0.9 }}>
              {productDetails.fullDescription}
            </p>

            {/* Quantity Selector */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Quantity:
              </label>
              <div className="row" style={{ gap: 8, alignItems: 'center' }}>
                <button 
                  className="btn secondary"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '40px', height: '40px' }}
                >
                  -
                </button>
                <span style={{ 
                  padding: '8px 16px', 
                  border: '1px solid #1c254a', 
                  borderRadius: '4px',
                  minWidth: '60px',
                  textAlign: 'center'
                }}>
                  {quantity}
                </span>
                <button 
                  className="btn secondary"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: '40px', height: '40px' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button 
              className="btn"
              onClick={addToCart}
              disabled={addingToCart}
              style={{ width: '100%', marginBottom: 16 }}
            >
              {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
            </button>

            {message && (
              <div style={{ 
                padding: '8px 12px', 
                backgroundColor: '#1c254a', 
                borderRadius: '4px',
                color: '#9db2ff',
                textAlign: 'center'
              }}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #1c254a' }}>
          <h3 style={{ marginBottom: 16 }}>Key Features</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {productDetails.features.map((feature, index) => (
              <li key={index} style={{ 
                padding: '8px 0', 
                borderBottom: '1px solid #1c254a',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ color: '#9db2ff', marginRight: 8 }}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Specifications Section */}
        {Object.keys(productDetails.specifications).length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Specifications</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {Object.entries(productDetails.specifications).map(([key, value]) => (
                <div key={key} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #1c254a'
                }}>
                  <span style={{ fontWeight: 600 }}>{key}:</span>
                  <span style={{ opacity: 0.9 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
