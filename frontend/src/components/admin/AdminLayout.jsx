import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Tag, Image, Boxes, BarChart3, ArrowLeft,
} from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/coupons', label: 'Coupons', icon: Tag },
  { to: '/admin/banners', label: 'Banners', icon: Image },
  { to: '/admin/inventory', label: 'Inventory', icon: Boxes },
  { to: '/admin/reports', label: 'Sales Reports', icon: BarChart3 },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-cream">
      <aside className="hidden xl:flex w-64 shrink-0 bg-ink text-cream flex-col fixed top-0 bottom-0 overflow-y-auto">
        <div className="p-6 border-b border-cream/10">
          <span className="font-display text-xl">Shrivi Creations</span>
          <p className="text-[11px] text-cream/40 tracking-wide mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive ? 'bg-gold text-ink font-medium' : 'text-cream/70 hover:bg-cream/10'
                }`
              }
            >
              <item.icon size={17} strokeWidth={1.75} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-cream/10">
          <Link to="/" className="flex items-center gap-2 text-sm text-cream/60 hover:text-cream transition-colors">
            <ArrowLeft size={15} /> Back to Store
          </Link>
        </div>
      </aside>

      <main className="flex-1 min-w-0 ml-0 xl:ml-64 p-4 sm:p-8">
        <div className="xl:hidden -mx-4 -mt-4 mb-6 bg-ink text-cream px-4 py-3 flex items-center gap-3">
          <span className="font-display text-lg shrink-0">Admin</span>
          <select
            value={location.pathname}
            onChange={(event) => navigate(event.target.value)}
            aria-label="Admin section"
            className="min-w-0 flex-1 bg-cream/10 border border-cream/20 rounded-lg px-3 py-2 text-sm text-cream outline-none focus:border-gold"
          >
            {navItems.map((item) => <option key={item.to} value={item.to} className="text-ink">{item.label}</option>)}
          </select>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
