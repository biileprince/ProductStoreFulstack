import fs from 'fs';
import path from 'path';
import { sql } from "../config/db.js";
import { fileURLToPath } from "url";

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Save image to filesystem
const saveImage = (image) => {
  const uploadDir = path.join(__dirname, '../../public/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const sanitizedFilename = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;
  const imagePath = path.join(uploadDir, sanitizedFilename);
  image.mv(imagePath);
  return `/uploads/${sanitizedFilename}`;
};

// Delete old image
const deleteOldImage = (imagePath) => {
  if (imagePath) {
    const fullPath = path.join(__dirname, '../../public', imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await sql`SELECT * FROM products ORDER BY created_at DESC`;
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  const { name, price } = req.body;
  const image = req.files?.image;

  if (!name || !price || !image) {
    return res.status(400).json({ 
      success: false, 
      message: "Name, price, and image are required" 
    });
  }

  // Validate image type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!validTypes.includes(image.mimetype)) {
    return res.status(400).json({
      success: false,
      message: "Invalid image type. Only JPEG, PNG, and GIF are allowed"
    });
  }

  try {
    const imagePath = saveImage(image);
    const newProduct = await sql`
      INSERT INTO products (name, price, image)
      VALUES (${name}, ${price}, ${imagePath})
      RETURNING *
    `;
    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await sql`SELECT * FROM products WHERE id=${id}`;
    if (product.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const image = req.files?.image;

  if (!name || !price) {
    return res.status(400).json({ 
      success: false, 
      message: "Name and price are required" 
    });
  }

  try {
    // Get current product
    const currentProduct = await sql`SELECT * FROM products WHERE id=${id}`;
    if (currentProduct.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let imagePath = currentProduct[0].image;
    
    // Handle new image
    if (image) {
      // Validate image type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(image.mimetype)) {
        return res.status(400).json({
          success: false,
          message: "Invalid image type. Only JPEG, PNG, and GIF are allowed"
        });
      }
      
      // Delete old image
      deleteOldImage(currentProduct[0].image);
      
      // Save new image
      imagePath = saveImage(image);
    }

    // Update product
    const updatedProduct = await sql`
      UPDATE products
      SET name=${name}, price=${price}, image=${imagePath}
      WHERE id=${id}
      RETURNING *
    `;

    res.status(200).json({ success: true, data: updatedProduct[0] });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await sql`SELECT * FROM products WHERE id=${id}`;
    if (product.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    
    // Delete image
    deleteOldImage(product[0].image);
    
    // Delete from database
    await sql`DELETE FROM products WHERE id=${id}`;
    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};