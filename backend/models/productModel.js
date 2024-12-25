import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    category: String,
    price: Number,
    subCategory: String,
    bestseller: Boolean,
    sizes: [String],
    image: [String], // Array of URLs
    date: { type: Date, default: Date.now }
});

const productModel = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel;