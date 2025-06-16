import { useState, useEffect } from "react";
import { DollarSign, Image as ImageIcon, Package, PlusCircle, X } from "lucide-react";

import toast from "react-hot-toast";
import { useProductStore } from './../../store/useProductStore';

export default function AddProductModal() {
  const { addProduct, formData, setFormData, loading, resetForm } = useProductStore();
  const [imagePreview, setImagePreview] = useState(null);
  
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
  
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleClose = () => {
    resetForm();
    setImagePreview(null);
    document.getElementById("add_product_modal").close();
  };

  return (
    <dialog id="add_product_modal" className="modal">
      <div className="modal-box max-w-md p-6 bg-base-100 rounded-lg shadow-xl">
        <form method="dialog">
          <button 
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
            onClick={handleClose}
          >
            <X size={18} />
          </button>
        </form>
        
        <h3 className="text-2xl font-bold mb-6 text-center">Add New Product</h3>
        
        <form onSubmit={addProduct} className="space-y-5">
          {/* Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Product Name</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/50">
                <Package size={18} />
              </div>
              <input
                type="text"
                placeholder="Product name"
                className="input input-bordered w-full pl-10"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>
          
          {/* Price */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Price</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/50">
                <DollarSign size={18} />
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="input input-bordered w-full pl-10"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
          </div>
          
          {/* Image Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Product Image</span>
            </label>
            
            <div className="flex flex-col items-center gap-3">
              {imagePreview ? (
                <div className="relative border-2 border-dashed border-base-300 rounded-lg w-full h-48 flex items-center justify-center">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-full max-w-full object-contain p-2"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 btn btn-circle btn-error btn-xs"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({ ...formData, image: null });
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-base-300 rounded-lg w-full h-48 flex flex-col items-center justify-center text-base-content/50 bg-base-200/30">
                  <ImageIcon size={36} className="mb-2" />
                  <p className="text-sm">No image selected</p>
                </div>
              )}
              
              <label className="btn btn-outline btn-sm w-full cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                Select Image
              </label>
              <p className="text-xs text-base-content/50 mt-1">
                JPEG, PNG, GIF (Max 10MB)
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="modal-action flex justify-end gap-3 mt-8">
            <button 
              type="button" 
              className="btn btn-ghost"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary gap-2"
              disabled={!formData.name || !formData.price || !formData.image || loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <PlusCircle size={18} />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}