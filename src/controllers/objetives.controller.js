import Objetives from '../models/objectives.model.js';

export const createObjetive = async (req, res) => {
    try {
        const { objective, qty_times } = req.body;
        const newObjetive = new Objetives({
            objective,
            qty_times,
            user: req.user.id,
        });
        const savedObjetive = await newObjetive.save();
        console.log(savedObjetive);
        res.json(savedObjetive);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}

export const getObjetives = async (req, res) => {
    try {
        const objetives = await Objetives.find({ user: req.user.id }).populate('user');
        res.status(200).json(objetives);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getObjetive = async (req, res) => {
    try {
        const objetive = await Objetives.findById({user: req.user.id});
        if (!objetive) {
            return res.status(404).json({ message: "Objetive not found" });
        }
        res.status(200).json(objetive);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateObjetive = async (req, res) => {
    try {
      const { qty_times } = req.body;
      const updatedObjetive = await Objetives.findByIdAndUpdate(
        req.params.id,
        { qty_times },
        { new: true }
      );
      if (!updatedObjetive) {
        return res.status(404).json({ message: "Objetive not found" });
      }
      res.status(200).json(updatedObjetive);
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error)
    }
  };

export const deleteObjetive = async (req, res) => {
    try {
        const objetive = await Objetives.findByIdAndDelete(req.params.id);
        if (!objetive) {
            return res.status(404).json({ message: "Objetive not found" });
        }
        res.status(200).json({ message: "Objetive deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}