import express from "express"
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../contrallers/productContraller.js";

const productRoutes = express.Router();

productRoutes.get("/",getAllProducts)
productRoutes.post("/",createProduct)
productRoutes.get("/:productId",getProductById)
productRoutes.delete("/:productId",deleteProduct)
productRoutes.put("/:productId",updateProduct)

export default productRoutes;




