import { useEffect } from "react";
import { Package, PlusCircle, RefreshCw } from "lucide-react";
import AddProductModal from "../components/AddProductModal";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";

import { useProductStore } from './../../store/useProductStore';

export default function HomePage() {
  const { products, loading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold">Product Inventory</h1>
        <div className="flex gap-2">
          <button
            className="btn btn-primary gap-2"
            onClick={() => document.getElementById("add_product_modal").showModal()}
          >
            <PlusCircle size={18} />
            Add Product
          </button>
          <button 
            className="btn btn-ghost btn-square" 
            onClick={fetchProducts}
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <AddProductModal />

      {/* Error Message */}
      {error && (
        <div className="alert alert-error mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-base-200 rounded-full p-6 mb-6">
            <Package size={48} className="text-base-content/30" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No products found</h3>
          <p className="text-base-content/70 max-w-md mb-6">
            Get started by adding your first product to the inventory
          </p>
          <button
            className="btn btn-primary"
            onClick={() => document.getElementById("add_product_modal").showModal()}
          >
            Add First Product
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        /* Product Grid */
        products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )
      )}
    </main>
  );
}