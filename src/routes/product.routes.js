import {Router} from "express";
import {createProduct, getProducts, getProductById, updateProductById, deleteProductById} from "../controllers/product.controller.js";

const router = Router();
router.post("/product", createProduct);
router.get("/product", getProducts);
router.get("/product/:id", getProductById);
router.put("/product/:id", updateProductById);
router.delete("/product/:id", deleteProductById);
export default router;