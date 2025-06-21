// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiPlus, FiMenu, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-indigo-600">
            <FiShoppingBag className="text-xl" />
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ProductHub
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:text-indigo-600'}`}
            >
              Products
            </Link>
            <Link 
              to="/create-product" 
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md"
            >
              <FiPlus /> Add Product
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 mt-2 animate-slide-down">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:text-indigo-600'}`}
              >
                Products
              </Link>
              <Link 
                to="/create-product" 
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
              >
                <FiPlus /> Add Product
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;