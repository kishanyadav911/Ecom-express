import { useState } from 'react';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useNavigate } from '../components/Router';
import { ShoppingCart, ChevronLeft, ChevronRight, Package, Truck, Shield } from 'lucide-react';

interface ProductDetailPageProps { slug: string; }

export function ProductDetailPage({ slug }: ProductDetailPageProps) {
  const { product, loading } = useProduct(slug);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      alert('Added to cart!');
    } catch (error) {
      alert('Please sign in to add items to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div className="animate-pulse"><div className="h-8 bg-gray-200 rounded w-1/4 mb-8" /></div></div>);
  if (!product) return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center"><h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1><button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-700">Back to products</button></div>);

  const images = product.images && product.images.length > 0 ? product.images : ['/placeholder.jpg'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-6"><ChevronLeft className="w-4 h-4" />Back to products</button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square">
            <img src={images[currentImageIndex]} alt={product.title} className="w-full h-full object-cover" />
            {images.length > 1 && (
              <>
                <button onClick={() => setCurrentImageIndex((i) => (i === 0 ? images.length - 1 : i - 1))} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={() => setCurrentImageIndex((i) => (i === images.length - 1 ? 0 : i + 1))} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"><ChevronRight className="w-5 h-5" /></button>
              </>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

          <div className="flex items-baseline gap-3 mb-6">
            <p className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
            {product.compare_price && product.compare_price > product.price && (
              <>
                <p className="text-xl text-gray-500 line-through">${product.compare_price.toFixed(2)}</p>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded">Save {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%</span>
              </>
            )}
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-4">
            <div className="flex items-center gap-3"><Package className="w-5 h-5 text-blue-600" /><span className="text-sm text-gray-700">In stock: {product.stock_quantity} units</span></div>
            <div className="flex items-center gap-3"><Truck className="w-5 h-5 text-blue-600" /><span className="text-sm text-gray-700">Free shipping on orders over $50</span></div>
            <div className="flex items-center gap-3"><Shield className="w-5 h-5 text-blue-600" /><span className="text-sm text-gray-700">30-day money-back guarantee</span></div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100 transition-colors">-</button>
              <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock_quantity, parseInt(e.target.value) || 1)))} className="w-16 text-center border-x border-gray-300" min="1" max={product.stock_quantity} />
              <button onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} className="px-4 py-2 hover:bg-gray-100 transition-colors">+</button>
            </div>

            <button onClick={handleAddToCart} disabled={adding || product.stock_quantity === 0} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"><ShoppingCart className="w-5 h-5" />{adding ? 'Adding...' : product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}</button>
          </div>

          {product.sku && <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>}
        </div>
      </div>
    </div>
  );
}
