import {v2 as cloudinary} from 'cloudinary'
import productModel from '../models/productModel.js'
import { log } from 'console';
import mongoose from 'mongoose';
// add Product 
const addProduct = async (req, res) => {
    try {
        // Log the request body to ensure all fields are being sent correctly
        console.log("Received body:", req.body);

        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        // Log individual fields
        console.log("Received name:", name);
        console.log("Received price:", price);
        console.log("Received sizes:", sizes);

        // Validate price
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice)) {
            return res.status(400).json({ success: false, message: "Invalid price value" });
        }

        // Parse and validate sizes if provided
        let parsedSizes = [];
        try {
            parsedSizes = JSON.parse(sizes);
            console.log("Parsed sizes:", parsedSizes);
        } catch (err) {
            console.error("Error parsing sizes:", err);
            return res.status(400).json({ success: false, message: "Invalid sizes format" });
        }

        // Get images from the request
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        if (images.length === 0) {
            return res.status(400).json({ success: false, message: "At least one image is required" });
        }

        // Upload images to Cloudinary
        const imagesUrl = await Promise.all(
            images.map(async (item) => {
                try {
                    console.log("Uploading image to Cloudinary:", item.path);
                    const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    console.log("Cloudinary upload result:", result.secure_url);
                    return result.secure_url;
                } catch (err) {
                    console.error("Error uploading image to Cloudinary:", err.message);
                    throw err; // Re-throw the error to handle it in the catch block
                }
            })
        );

        // Prepare product data for saving
        const productData = {
            name,
            description,
            category,
            price: parsedPrice, // Store the parsed price
            subCategory,
            bestseller: bestseller === "true", // Convert bestseller to boolean
            sizes: parsedSizes,
            image: imagesUrl, // Store the Cloudinary URLs
            date: Date.now() // Current timestamp for date field
        };

        console.log("Prepared product data:", productData);

        // Create a new product instance
        const product = new productModel(productData);

        // Save the product to the database
        await product.save();

        // Return success response
        res.status(201).json({ success: true, message: "Product added successfully" });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
    



// list Product
const listProduct = async (req,res) => {
    try {
        const products = await productModel.find({}); 
        res.json({success:true, products})

    } catch (error) {
        console.log("Error listing product:", error);
        res.status(500).json({ success: false, message: error.message});
    }
}

// remove Product


const removeProduct = async (req, res) => {
    try {
        // Log the entire request body to see if the id is being passed
        const {productId} = req.body;
        console.log(productId)
        // Ensure the product exists before trying to delete
        const product = await productModel.findOne({ _id: productId });
        console.log("Found Product:", product);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Proceed to delete the product
        await productModel.findByIdAndDelete(productId);
        res.json({ success: true, message: "Product removed" });
    } catch (error) {
        console.log("Error removing product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// single Product Info
const singleProduct = async (req,res) => {
    try {
        const {productId} = req.body
        const product = await productModel.findById(productId);
        res.json({success:true, product})
    } catch (error) {
        console.log("Error retrieving product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export {singleProduct, removeProduct, listProduct,addProduct }