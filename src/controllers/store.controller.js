import Store from "../models/store.model.js";

export const createStore = async (req, res) => {
    try {
        const { product, price } = req.body;
        const newStore = new Store({
        product,
        price,
        user: req.user.id,
        });
        const savedStore = await newStore.save();
        res.json(savedStore);
        console.log(savedStore);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getStores = async (req, res) => {
    try {
        const stores = await Store.find({ user: req.user.id }).populate('user');
        res.status(200).json(stores);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getStoreById = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);
        if (!store) {
        return res.status(404).json({ message: "Store not found" });
        }
        res.status(200).json(store);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateStoreById = async (req, res) => {
    try {
        const { product, price } = req.body;
        const updatedStore = await Store.findByIdAndUpdate(
        req.user.id,
        { product, price },
        { new: true }
        );
        if (!updatedStore) {
        return res.status(404).json({ message: "Store not found" });
        }
        res.status(200).json(updatedStore);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteStoreById = async (req, res) => {
    try {
        const store = await Store.findByIdAndDelete(req.params.id);
        if (!store) {
        return res.status(404).json({ message: "Store not found" });
        }
        res.status(200).json({ message: "Store deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}