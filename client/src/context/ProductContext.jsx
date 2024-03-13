import { createContext, useContext } from "react";
import {
    createProductRequest,
    getProductsRequest,
    getProductRequest,
    updateProductRequest,
    deleteProductRequest,
    getProductsOnStoreRequest
} from "../api/product.js";

export const ProductContext = createContext();

export const useProductAuth = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProduct must be used within a ProductProvider");
    }
    return context;
}

export const ProductProvider = ({ children }) => {

    const createNewProduct = async (product) => {
        try {
            const res = await createProductRequest(product);
            console.log(res.data);

        } catch (error) {
            console.log(error.response);
        }
    }

    const getProduct = async (id) => {
        try {
            const res = await getProductRequest(id);
            console.log(res.data);

        } catch (error) {
            console.log(error.response);
        }
    }

    const getProducts = async () => {
        try {
            const res = await getProductsRequest();
            console.log(res.data);

        } catch (error) {
            console.log(error.response);
        }
    }

    const getProductsOnStore = async () => {
        try {
            const res = await getProductsOnStoreRequest();
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.log(error.response);
        }
    }

    const updateProduct = async (id, product) => {
        try {
            const res = await updateProductRequest(id, product);
            console.log(res.data);

        } catch (error) {
            console.log(error.response);
        }
    }

    const deleteProduct = async (id) => {
        try {
            const res = await deleteProductRequest(id);
            console.log(res.data);

        } catch (error) {
            console.log(error.response);
        }
    }

    const value = {
        createNewProduct,
        getProduct,
        getProducts,
        getProductsOnStore,
        updateProduct,
        deleteProduct,
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}