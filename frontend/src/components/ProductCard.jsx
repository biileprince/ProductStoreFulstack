// src/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import { FiTrash2, FiEdit } from 'react-icons/fi';
import { getImageUrl } from '../utils/imageHelper';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onDelete }) => {
  const imageUrl = getImageUrl(product.image);
  
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative">
        <div className="h-56 overflow-hidden bg-gray-100 flex items-center justify-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          ) : (
            <div className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <Link 
            to={`/edit-product/${product.id}`}
            className="p-2 bg-white rounded-full shadow-md text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="Edit"
          >
            <FiEdit size={18} />
          </Link>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 bg-white rounded-full shadow-md text-red-600 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
            <p className="text-lg font-bold text-indigo-600 mt-1">${parseFloat(product.price).toFixed(2)}</p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {new Date(product.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
          <Link 
            to={`/product/${product.id}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;