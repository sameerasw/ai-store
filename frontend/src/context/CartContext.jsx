import React, { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { useAuth } from '../auth'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState([]) // [{productId, qty, product}]
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  // Helper function to get user-specific cart key
  const getCartKey = () => user ? `cart_${user.id || user.username}` : 'cart_guest'

  // Load cart from localStorage when user changes
  useEffect(() => {
    if (user) {
      try {
        const cartKey = getCartKey()
        const savedCart = localStorage.getItem(cartKey)
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          if (Array.isArray(parsedCart)) {
            setCart(parsedCart)
          }
        } else {
          // Clear cart if no saved cart for this user
          setCart([])
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        setCart([])
      }
    } else {
      // Clear cart when user logs out
      setCart([])
    }
  }, [user])

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (user) {
      try {
        const cartKey = getCartKey()
        localStorage.setItem(cartKey, JSON.stringify(cart))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [cart, user])

  const addToCart = (product, quantity = 1) => {
    setCart((c) => {
      const idx = c.findIndex((x) => x.productId === product.id)
      if (idx >= 0) {
        const copy = [...c]
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + quantity }
        return copy
      }
      return [...c, { productId: product.id, qty: quantity, product }]
    })
  }

  const removeFromCart = (productId) => setCart((c) => c.filter((x) => x.productId !== productId))

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((c) => c.map(item => 
      item.productId === productId 
        ? { ...item, qty: newQty }
        : item
    ))
  }

  const clearCart = () => {
    setCart([])
    setAppliedCoupon(null)
    setCoupon('')
  }

  const subtotal = useMemo(() => cart.reduce((s, x) => s + x.product.price * x.qty, 0), [cart])
  
  const discount = useMemo(() => {
    if (!appliedCoupon) return 0
    const code = appliedCoupon.toUpperCase()
    if (code === 'SAVE10') return subtotal * 0.1
    if (code === 'SAVE20') return subtotal * 0.2
    return 0
  }, [appliedCoupon, subtotal])
  
  const afterDiscount = Math.max(0, subtotal - discount)
  const tax = useMemo(() => afterDiscount * 0.08, [afterDiscount]) // 8% tax
  
  const shipping = useMemo(() => {
    const code = (appliedCoupon || '').toUpperCase()
    if (code === 'FREESHIP' || afterDiscount >= 100) return 0
    return cart.length > 0 ? 5 : 0
  }, [appliedCoupon, afterDiscount, cart.length])
  
  const total = afterDiscount + tax + shipping

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase()
    if (!code) return setAppliedCoupon(null)
    const valid = ['SAVE10', 'SAVE20', 'FREESHIP']
    if (valid.includes(code)) setAppliedCoupon(code)
    else setAppliedCoupon(null)
  }

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    coupon,
    setCoupon,
    appliedCoupon,
    applyCoupon,
    subtotal,
    discount,
    afterDiscount,
    tax,
    shipping,
    total
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
