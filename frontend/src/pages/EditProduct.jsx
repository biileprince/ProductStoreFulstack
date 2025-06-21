// src/pages/EditProduct.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { FiArrowLeft } from 'react-icons/fi';
import Spinner from '../components/Spinner';
import { getProduct } from '../services/api';
import { motion } from 'framer-motion';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  if (loading) return <Spinner className="mt-20" />;
  if (!product) return <div className="text-center py-20 text-red-500 text-xl">Product not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(`/product/${id}`)}
        className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 group"
      >
        <FiArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" /> 
        Back to Product
      </button>

      <motion.div 
        className="bg-white rounded-xl shadow-xl p-6 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
          <p className="text-gray-600 mt-1">Update the details of your product below</p>
        </div>

        <ProductForm 
          isEditMode={true} 
          initialProduct={product} 
        />
      </motion.div>
    </div>
  );
};

export default EditProduct;