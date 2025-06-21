// src/components/ProductForm.jsx
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FileUpload from './FileUpload';
import Spinner from './Spinner';
import { createProduct, updateProduct } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  price: Yup.number()
    .min(0.01, 'Must be greater than 0')
    .required('Required'),
});

const ProductForm = ({ 
  isEditMode = false, 
  initialProduct = null 
}) => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const initialValues = initialProduct || {
    name: '',
    price: '',
    image: ''
  };

  const handleSubmit = async (values) => {
    if (!isEditMode && !imageFile) {
      setError('Please select an image');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('price', values.price);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      let response;
      if (isEditMode && initialProduct) {
        response = await updateProduct(initialProduct.id, formData);
      } else {
        response = await createProduct(formData);
      }
      
      navigate(`/product/${response.id}`);
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={ProductSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isValid, dirty }) => (
          <Form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <FileUpload 
                onFileSelect={setImageFile} 
                initialPreview={initialProduct?.image}
              />
              <p className="mt-1 text-xs text-gray-500">
                JPEG, PNG or GIF (Max 10MB)
              </p>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <Field
                name="name"
                type="text"
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                placeholder="Enter product name"
              />
              <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price ($)
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  $
                </span>
                <Field
                  name="price"
                  type="number"
                  step="0.01"
                  className="block w-full pl-8 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                  placeholder="0.00"
                />
              </div>
              <ErrorMessage name="price" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div className="pt-4 flex justify-end">
              <motion.button
                type="submit"
                disabled={!dirty || !isValid || isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Spinner size="sm" className="mr-2" />
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </div>
                ) : isEditMode ? 'Update Product' : 'Create Product'}
              </motion.button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default ProductForm;