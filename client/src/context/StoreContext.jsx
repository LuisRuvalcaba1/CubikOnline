import { createContext,useContext } from "react";
import {
    createStoreRequest,
    getStoresRequest
} from "../api/store.js";

export const StoreContext = createContext();

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
}

export const StoreProvider = ({ children }) => {

    const createNewStore = async (store) => {
        try {
            const res = await createStoreRequest(store);
            console.log(res.data);

        } catch (error) {
            console.log(error.response);
        }
    }

    const getStores = async () => {
        try {
            const res = await getStoresRequest();
            return res.data;
        } catch (error) {
            console.log(error.response);
        }
    }

    const value = {
        createNewStore,
        getStores
    };

    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    );
}

