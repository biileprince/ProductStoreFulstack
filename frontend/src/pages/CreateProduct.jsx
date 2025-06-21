// src/pages/CreateProduct.jsx
import ProductForm from '../components/ProductForm';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CreateProduct = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 group"
      >
        <FiArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" /> 
        Back to Products
      </button>

      <motion.div 
        className="bg-white rounded-xl shadow-xl p-6 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Create New Product</h1>
          <p className="text-gray-600 mt-1">Fill in the details below to add a new product to your catalog</p>
        </div>

        <ProductForm />
      </motion.div>
    </div>
  );
};

export default CreateProduct;