import TimerPvP from "../models/timerpvp.model.js";
import mongoose from "mongoose";

export const crearTimerPvP = async (req, res) => {
  try {
    // Validar los datos recibidos
    const { winner, loser } = req.body;
    if (!winner || !loser) {
      return res
        .status(400)
        .json({ error: "Se requieren los campos winner y loser" });
    }

    // Lógica para crear el nuevo TimerPvP
    const nuevoTimerPvP = new TimerPvP({ winner, loser });
    const timerPvPGuardado = await nuevoTimerPvP.save();

    res.status(201).json(timerPvPGuardado);
  } catch (error) {
    res.status(500).json({ error: "Error al crear TimerPvP" });
  }
};

export const getTimerPvPById = async (req, res) => {
  try {
    const timerpvp = await TimerPvP.findById(req.params.id);
    res.status(200).json(timerpvp);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateTimerPvPById = async (req, res) => {
  try {
    await TimerPvP.findByIdAndUpdate(req.params.id, req.body);
    res.status(204).json();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteTimerPvPById = async (req, res) => {
  try {
    await TimerPvP.findByIdAndDelete(req.params.id);
    res.status(204).json();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
