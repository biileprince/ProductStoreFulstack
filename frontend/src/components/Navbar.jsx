import { ShoppingBag, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ThemeSelector from "./ThemeSelector";

import { useProductStore } from './../../store/useProductStore';

export default function Navbar() {
  const { products } = useProductStore();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="bg-base-100/90 backdrop-blur-lg border-b border-base-300 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="navbar px-0 py-3">
          {/* Logo */}
          <div className="flex-1">
            <Link to="/" className="flex items-center gap-2">
              <ShoppingCart size={28} className="text-primary" />
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                PenStore
              </span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <ThemeSelector />

            {isHomePage && (
              <div className="indicator">
                <button className="btn btn-ghost btn-circle">
                  <ShoppingBag size={20} />
                </button>
                <span className="badge badge-sm badge-primary indicator-item">
                  {products.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}