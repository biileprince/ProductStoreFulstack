import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  currentProduct: null,
  formData: { name: "", price: "", image: null },

  setFormData: (formData) => set({ formData }),
  resetForm: () => set({ formData: { name: "", price: "", image: null } }),

  createFormData: (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price);
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }
    return formData;
  },

  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true, error: null });
    
    try {
      const { formData } = get();
      const payload = get().createFormData(formData);
      
      const response = await axios.post(`${BASE_URL}/api/products`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      await get().fetchProducts();
      get().resetForm();
      toast.success("Product added successfully");
      document.getElementById("add_product_modal").close();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to add product";
      console.error("Add product error:", errorMsg);
      toast.error(errorMsg);
      set({ error: errorMsg });
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      set({ products: response.data.data });
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to load products";
      set({ error: errorMsg });
      toast.error(errorMsg);
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      set(prev => ({
        products: prev.products.filter(p => p.id !== id),
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      const errorMsg = "Failed to delete product";
      set({ error: errorMsg });
      toast.error(errorMsg);
    } finally {
      set({ loading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BASE_URL}/api/products/${id}`);
      set({
        currentProduct: response.data.data,
        formData: { 
          name: response.data.data.name, 
          price: response.data.data.price,
          image: null
        }
      });
    } catch (error) {
      const errorMsg = "Failed to load product";
      set({ error: errorMsg });
      toast.error(errorMsg);
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const { formData } = get();
      const payload = get().createFormData(formData);
      
      const response = await axios.put(
        `${BASE_URL}/api/products/${id}`, 
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      set({ currentProduct: response.data.data });
      toast.success("Product updated successfully");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to update product";
      set({ error: errorMsg });
      toast.error(errorMsg);
    } finally {
      set({ loading: false });
    }
  },
}));