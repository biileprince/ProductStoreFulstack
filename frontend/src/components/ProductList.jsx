// src/components/ProductList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { getProducts, deleteProduct } from '../services/api';
import Spinner from './Spinner';
import { motion, AnimatePresence } from 'framer-motion';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
    
    // Check for success message from navigation state
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(product => product.id !== id));
        setSuccessMessage('Product deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError('Failed to delete product: ' + (err.message || 'Server error'));
      }
    }
  };

  if (loading) return <Spinner className="mt-20" />;
  if (error) return <div className="text-center py-20 text-red-500 text-xl">{error}</div>;

  return (
    <div>
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Product Catalog</h1>
          <p className="text-gray-600 mt-1">Manage your products and inventory</p>
        </div>
        <Link 
          to="/create-product"
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md"
        >
          Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <motion.div 
          className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
            </svg>
          </div>
          <h3 className="mt-6 text-xl font-semibold text-gray-900">No products found</h3>
          <p className="mt-2 text-gray-600 max-w-md mx-auto">Get started by adding your first product to the catalog</p>
          <div className="mt-6">
            <Link 
              to="/create-product"
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md"
            >
              Create First Product
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ProductList;