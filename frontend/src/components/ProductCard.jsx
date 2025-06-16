import { Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useProductStore } from './../../store/useProductStore';

export default function ProductCard({ product }) {
  const { deleteProduct } = useProductStore();
  
  return (
    <div className="card bg-base-100 border border-base-300 rounded-xl overflow-hidden transition-shadow hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-square bg-base-200">
        {product.image ? (
          <img 
            src={`${import.meta.env.VITE_API_URL || "http://localhost:3000/"}${product.image}`} 
            alt={product.name} 
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-base-content/30">
            <div className="bg-base-200 border-2 border-dashed rounded-xl w-16 h-16" />
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="card-body p-4">
        <h3 className="card-title text-lg font-semibold truncate">{product.name}</h3>
        <p className="text-2xl font-bold text-primary mt-1">
          ${Number(product.price).toFixed(2)}
        </p>
        
        {/* Actions */}
        <div className="card-actions justify-end mt-4">
          <Link
            to={`/product/${product.id}`}
            className="btn btn-sm btn-outline btn-info"
          >
            <Edit size={16} className="mr-1" />
            Edit
          </Link>
          
          <button
            className="btn btn-sm btn-outline btn-error"
            onClick={() => deleteProduct(product.id)}
          >
            <Trash2 size={16} className="mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}