import { useState } from 'react';
import { Package, ShoppingBag, FolderOpen, FileText, Settings, Tag } from 'lucide-react';
import { AdminProducts } from '../components/admin/AdminProducts';
import { AdminOrders } from '../components/admin/AdminOrders';
import { AdminCategories } from '../components/admin/AdminCategories';
import { AdminBlog } from '../components/admin/AdminBlog';
import { AdminCoupons } from '../components/admin/AdminCoupons';
import { AdminSettings } from '../components/admin/AdminSettings';

type Tab = 'products' | 'orders' | 'categories' | 'blog' | 'coupons' | 'settings';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('products');

  const tabs = [
    { id: 'products' as Tab, label: 'Products', icon: Package },
    { id: 'orders' as Tab, label: 'Orders', icon: ShoppingBag },
    { id: 'categories' as Tab, label: 'Categories', icon: FolderOpen },
    { id: 'blog' as Tab, label: 'Blog', icon: FileText },
    { id: 'coupons' as Tab, label: 'Coupons', icon: Tag },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-2 space-y-1 sticky top-24">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            {activeTab === 'products' && <AdminProducts />}
            {activeTab === 'orders' && <AdminOrders />}
            {activeTab === 'categories' && <AdminCategories />}
            {activeTab === 'blog' && <AdminBlog />}
            {activeTab === 'coupons' && <AdminCoupons />}
            {activeTab === 'settings' && <AdminSettings />}
          </main>
        </div>
      </div>
    </div>
  );
}
