// src/components/Footer.jsx
import { FiGithub, FiTwitter, FiLinkedin, FiShoppingBag } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <FiShoppingBag className="text-white text-xl" />
              </div>
              <span className="font-bold text-xl">ProductHub</span>
            </div>
            <p className="text-gray-400 mt-2 text-sm">The ultimate product management solution</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <FiGithub size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <FiTwitter size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <FiLinkedin size={20} />
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} ProductHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;