import { ReactNode } from 'react';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../hooks/useCart';
import { useNavigate } from './Router';

interface LayoutProps { children: ReactNode; }

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => navigate('/')} className="text-2xl font-bold text-gray-900 hover:text-blue-600">ShopHub</button>
            <nav className="hidden md:flex gap-6">
              <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900">Products</button>
              <button onClick={() => navigate('/blog')} className="text-gray-600 hover:text-gray-900">Blog</button>
            </nav>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <button onClick={() => navigate('/cart')} className="relative p-2 text-gray-600 hover:text-gray-900">
                    <ShoppingCart className="w-6 h-6" />
                    {itemCount > 0 && <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{itemCount}</span>}
                  </button>
                  <div className="relative group">
                    <button className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900"><User className="w-6 h-6" /></button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <button onClick={() => navigate('/dashboard')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"><Package className="w-4 h-4" />My Orders</button>
                      <button onClick={signOut} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"><LogOut className="w-4 h-4" />Sign Out</button>
                    </div>
                  </div>
                </>
              ) : (
                <button onClick={() => navigate('/auth')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Sign In</button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ShopHub</h3>
              <p className="text-gray-400 text-sm">Your one-stop shop for amazing products with fast shipping and great customer service.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigate('/')} className="hover:text-white transition-colors">Products</button></li>
                <li><button onClick={() => navigate('/blog')} className="hover:text-white transition-colors">Blog</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-400 text-center">© {new Date().getFullYear()} ShopHub. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
