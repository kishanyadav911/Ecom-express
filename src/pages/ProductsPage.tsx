import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useCart } from '../hooks/useCart';
import { useNavigate } from '../components/Router';
import { ShoppingCart, Filter } from 'lucide-react';

export function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { products, loading: productsLoading } = useProducts(selectedCategory || undefined);
  const { categories } = useCategories();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try { await addToCart(productId, 1); } catch (error) { alert('Please sign in to add items to cart'); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
      <p className="text-gray-600 mb-8">Discover our curated collection of premium products</p>

      <div className="flex gap-8">
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-64 flex-shrink-0`}>
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="md:hidden text-gray-500 hover:text-gray-700">Close</button>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="category" checked={!selectedCategory} onChange={() => setSelectedCategory('')} className="text-blue-600" />
                <span className="text-sm text-gray-700">All Products</span>
              </label>
              {categories.map((category) => (
                <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="category" checked={selectedCategory === category.id} onChange={() => setSelectedCategory(category.id)} className="text-blue-600" />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">{productsLoading ? 'Loading...' : `${products.length} products found`}</p>
            <button onClick={() => setShowFilters(true)} className="md:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md"><Filter className="w-4 h-4" />Filters</button>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => (<div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"><div className="w-full h-64 bg-gray-200" /><div className="p-4 space-y-3"><div className="h-4 bg-gray-200 rounded w-3/4" /></div></div>))}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12"><p className="text-gray-500 mb-4">No products found</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} onClick={() => navigate(`/product/${product.slug}`)} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                  <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                    {product.compare_price && product.compare_price > product.price && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">Save {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%</div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                        {product.compare_price && product.compare_price > product.price && <p className="text-sm text-gray-500 line-through">${product.compare_price.toFixed(2)}</p>}
                      </div>

                      <button onClick={(e) => handleAddToCart(product.id, e)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><ShoppingCart className="w-4 h-4" />Add</button>
                    </div>

                    {product.stock_quantity <= 5 && product.stock_quantity > 0 && <p className="text-xs text-orange-600 mt-2">Only {product.stock_quantity} left!</p>}
                    {product.stock_quantity === 0 && <p className="text-xs text-red-600 mt-2">Out of stock</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
