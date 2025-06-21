// src/pages/ProductDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi';
import Spinner from '../components/Spinner';
import { getProduct, deleteProduct } from '../services/api';
import { getImageUrl } from '../utils/imageHelper';
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      setIsDeleting(true);
      await deleteProduct(id);
      navigate('/', { state: { message: 'Product deleted successfully' } });
    } catch (err) {
      setError('Failed to delete product: ' + (err.message || 'Server error'));
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <Spinner className="mt-20" />;
  if (error) return <div className="text-center py-20 text-red-500 text-xl">{error}</div>;
  if (!product) return <div className="text-center py-20 text-gray-500 text-xl">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 group"
      >
        <FiArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" /> 
        Back to Products
      </button>

      <motion.div 
        className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="md:flex">
          <div className="md:w-1/2 bg-gray-50 p-8 flex items-center justify-center">
            <div className="bg-gray-100 rounded-xl w-full h-full flex items-center justify-center">
              {product.image ? (
                <img 
                  src={getImageUrl(product.image)} 
                  alt={product.name}
                  className="max-h-96 object-contain rounded-lg"
                />
              ) : (
                <div className="text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:w-1/2 p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                <div className="mt-2 flex items-center">
                  <span className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <motion.button
                  onClick={() => navigate(`/edit-product/${id}`)}
                  className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors"
                  title="Edit Product"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiEdit size={20} />
                </motion.button>
                <motion.button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors disabled:opacity-50"
                  title="Delete Product"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isDeleting ? <Spinner size="sm" /> : <FiTrash2 size={20} />}
                </motion.button>
              </div>
            </div>
            
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Information</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Product ID</dt>
                  <dd className="mt-1 text-lg font-medium text-gray-900">#{product.id}</dd>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <dt className="text-sm font-medium text-gray-500">Added Date</dt>
                  <dd className="mt-1 text-lg font-medium text-gray-900">
                    {new Date(product.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </dd>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      Active
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;