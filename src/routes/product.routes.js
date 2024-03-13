import {Router} from "express";
import {createProduct, getProducts, getProductById, updateProductById, deleteProductById, getProductsOnStore} from "../controllers/product.controller.js";

const router = Router();
router.post("/product", createProduct);
router.get("/product", getProducts);
router.get("/store", getProductsOnStore);
router.get("/product/:id", getProductById);
router.put("/product/:id", updateProductById);
router.delete("/product/:id", deleteProductById);
export default router;