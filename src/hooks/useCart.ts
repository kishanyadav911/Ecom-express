import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Product } from './useProducts';

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

export function useCart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchCart();
    else { setCartItems([]); setLoading(false); }
  }, [user]);

  async function fetchCart() {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, product:products(*)')
        .eq('user_id', user.id);
      if (error) throw error;
      setCartItems(data || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(productId: string, quantity: number = 1) {
    if (!user) throw new Error('Please sign in to add items to cart');
    try {
      const existingItem = cartItems.find(item => item.product_id === productId);
      if (existingItem) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity, updated_at: new Date().toISOString() })
          .eq('id', existingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({ user_id: user.id, product_id: productId, quantity });
        if (error) throw error;
      }
      await fetchCart();
    } catch (err) {
      console.error('Error adding to cart:', err);
      throw err;
    }
  }

  async function updateQuantity(cartItemId: string, quantity: number) {
    if (!user) return;
    try {
      if (quantity <= 0) {
        await removeFromCart(cartItemId);
        return;
      }
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('id', cartItemId);
      if (error) throw error;
      await fetchCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
      throw err;
    }
  }

  async function removeFromCart(cartItemId: string) {
    if (!user) return;
    try {
      const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId);
      if (error) throw error;
      await fetchCart();
    } catch (err) {
      console.error('Error removing from cart:', err);
      throw err;
    }
  }

  async function clearCart() {
    if (!user) return;
    try {
      const { error } = await supabase.from('cart_items').delete().eq('user_id', user.id);
      if (error) throw error;
      setCartItems([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
      throw err;
    }
  }

  const total = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return { cartItems, loading, addToCart, updateQuantity, removeFromCart, clearCart, refetch: fetchCart, total, itemCount };
}
