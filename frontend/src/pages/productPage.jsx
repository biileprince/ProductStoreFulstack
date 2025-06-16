import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Image as ImageIcon } from "lucide-react";
import { useProductStore } from "../../store/useProductStore";
import toast from "react-hot-toast";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentProduct, 
    formData, 
    setFormData, 
    loading, 
    error, 
    fetchProduct, 
    updateProduct, 
    deleteProduct 
  } = useProductStore();
  
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProduct(id);
  }, [id, fetchProduct]);

  useEffect(() => {
    if (currentProduct?.image) {
      setImagePreview(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${currentProduct.image}`);
    }
  }, [currentProduct]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please select an image (JPEG, PNG, GIF)");
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size exceeds 10MB limit");
      return;
    }
    
    setFormData({ ...formData, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProduct(id);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      navigate("/");
    }
  };

  if (loading && !currentProduct) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button 
        onClick={() => navigate("/")} 
        className="btn btn-ghost mb-6"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Products
      </button>

      <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div>
              <div className="bg-base-200 rounded-lg aspect-square flex items-center justify-center mb-4 overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={currentProduct?.name || "Product"}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="text-center text-base-content/50">
                    <ImageIcon size={48} className="mx-auto mb-2" />
                    <p>No product image</p>
                  </div>
                )}
              </div>
              
              <label className="btn btn-outline w-full cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                Change Image
              </label>
            </div>
            
            {/* Form Section */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Product Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Product name"
                    className="input input-bordered w-full"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                {/* Price */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Price</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="input input-bordered w-full"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                
                {/* Actions */}
                <div className="flex justify-between pt-6 border-t border-base-300">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="btn btn-error"
                  >
                    <Trash2 size={18} className="mr-2" />
                    Delete Product
                  </button>
                  
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!formData.name || !formData.price || loading}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}