import { createContext, useContext, useState, useCallback } from 'react'
import api from '../api/axios'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  const refreshCart = useCallback(async () => {
    try {
      const { data } = await api.get('/cart')
      setCartItems(data)
    } catch {
      setCartItems([])
    }
  }, [])

  const addToCart = async (productId, quantity = 1) => {
    await api.post('/cart', { productId, quantity })
    await refreshCart()
  }

  const updateQuantity = async (cartItemId, quantity) => {
    await api.put(`/cart/${cartItemId}?quantity=${quantity}`)
    await refreshCart()
  }

  const removeItem = async (cartItemId) => {
    await api.delete(`/cart/${cartItemId}`)
    await refreshCart()
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, refreshCart, addToCart, updateQuantity, removeItem, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
