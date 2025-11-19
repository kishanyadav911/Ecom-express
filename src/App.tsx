import { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useRoute } from './components/Router';
import { supabase } from './lib/supabase';
import { Layout } from './components/Layout';
import { AuthPage } from './pages/AuthPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';

function App() {
  const route = useRoute();
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      checkIsAdmin();
    }
  }, [user]);

  async function checkIsAdmin() {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle();

    setIsAdmin(data?.is_admin || false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    if (route === '/auth') {
      return <AuthPage />;
    }

    if (route === '/admin') {
      if (!user || !isAdmin) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-600">Access denied. Admin only.</p>
          </div>
        );
      }
      return <AdminPage />;
    }

    if (route === '/dashboard') {
      if (!user) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-600">Please sign in to view your dashboard.</p>
          </div>
        );
      }
      return <DashboardPage />;
    }

    if (route === '/cart') {
      return <CartPage />;
    }

    if (route === '/checkout') {
      if (!user) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-600">Please sign in to checkout.</p>
          </div>
        );
      }
      return <CheckoutPage />;
    }

    if (route === '/blog') {
      return <BlogPage />;
    }

    if (route.startsWith('/blog/')) {
      const slug = route.substring(6);
      return <BlogDetailPage slug={slug} />;
    }

    if (route.startsWith('/product/')) {
      const slug = route.substring(9);
      return <ProductDetailPage slug={slug} />;
    }

    return <ProductsPage />;
  };

  return (
    <Layout>
      {renderPage()}

      {typeof window !== 'undefined' && window._seoSettings && (
        <>
          {window._seoSettings.analytics?.google_analytics && (
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${window._seoSettings.analytics.google_analytics}`}
            />
          )}
          {window._seoSettings.analytics?.meta_pixel && (
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${window._seoSettings.analytics.meta_pixel}&ev=PageView&noscript=1`}
            />
          )}
        </>
      )}
    </Layout>
  );
}

export default App;
