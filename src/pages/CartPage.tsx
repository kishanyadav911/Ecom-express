import { useCart } from '../hooks/useCart';
import { useNavigate } from '../components/Router';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export function CartPage() {
  const { cartItems, loading, updateQuantity, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  if (loading) return (<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div className="animate-pulse space-y-4">{[...Array(3)].map((_, i) => (<div key={i} className="h-32 bg-gray-200 rounded" />))}</div></div>);

  if (cartItems.length === 0) return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
      <button onClick={() => navigate('/')} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Browse Products</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="space-y-4 mb-8">
        {cartItems.map((item) => {
          const product = item.product;
          if (!product) return null;

          return (
            <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 flex gap-4">
              <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-2">${product.price.toFixed(2)} each</p>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100 transition-colors"><Minus className="w-4 h-4" /></button>
                    <span className="px-4 py-1 text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= product.stock_quantity} className="px-3 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50"><Plus className="w-4 h-4" /></button>
                  </div>

                  <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-700 transition-colors p-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">${(product.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{total >= 50 ? 'Free' : '$5.00'}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>${(total * 0.1).toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between text-xl font-bold text-gray-900">
            <span>Total</span>
            <span>${(total + (total >= 50 ? 0 : 5) + total * 0.1).toFixed(2)}</span>
          </div>
        </div>

        <button onClick={() => navigate('/checkout')} className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">Proceed to Checkout</button>
      </div>
    </div>
  );
}
