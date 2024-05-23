import Encuesta from "../models/encuesta.model.js";

export const createEncuesta = async (req, res) => {
  try {
    const { user, statusCube, phaseCube, timeCube } = req.body;
    const newEncuesta = new Encuesta({ user, statusCube, phaseCube, timeCube });
    const savedEncuesta = await newEncuesta.save();
    res.json(savedEncuesta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEncuestas = async (req, res) => {
  try {
    const encuestas = await Encuesta.find();
    res.json(encuestas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEncuesta = async (req, res) => {
  try {
    const { id } = req.params;
    const encuesta = await Encuesta.findById(id);
    if (!encuesta)
      return res.status(404).json({ message: "Encuesta not found" });
    res.json(encuesta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEncuesta = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, statusCube, phaseCube, timeCube } = req.body;
    const encuesta = await Encuesta.findByIdAndUpdate(id, {
      user,
      statusCube,
      phaseCube,
      timeCube,
    });
    if (!encuesta)
      return res.status(404).json({ message: "Encuesta not found" });
    res.json(encuesta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEncuesta = async (req, res) => {
  try {
    const { id } = req.params;
    const encuesta = await Encuesta.findByIdAndDelete(id);
    if (!encuesta)
      return res.status(404).json({ message: "Encuesta not found" });
    res.json({ message: "Encuesta deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
