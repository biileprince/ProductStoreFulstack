import React from "react";

import { Route, Routes } from "react-router-dom";
import ProductPage from "./pages/productPage";
import HomePage from "./pages/Home";

import { useThemeStore } from "./../store/useThemeStore";
import Navbar from './components/Navbar';

const App = () => {
  const { theme } = useThemeStore();

  return (
    <div
      className="min-h-screen bg-base-200 transition-colors duration-300 "
      data-theme={theme}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </div>
  );
};

export default App;
