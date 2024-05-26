import TimerPvP from '../models/timerpvp.model.js';
import mongoose from 'mongoose';

export const createTimerPvP = async (req, res) => {
  try {
      const { winner, loser } = req.body;
      if (!mongoose.Types.ObjectId.isValid(winner) || !mongoose.Types.ObjectId.isValid(loser)) {
          return res.status(400).json({ message: 'Winner o Loser no son ObjectId válidos' });
      }
      const timerpvp = await TimerPvP.create({ winner, loser });
      res.status(201).json(timerpvp);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};
export const getTimerPvPById = async (req, res) => {
  try {
      const timerpvp = await TimerPvP.findById(req.params.id);
      res.status(200).json(timerpvp);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
}
export const updateTimerPvPById = async (req, res) => {
  try {
      await TimerPvP.findByIdAndUpdate
          (req.params.id, req.body);
      res.status(204).json();
  }
  catch (error) {
      res.status(404).json({ message: error.message });
  }
}
export const deleteTimerPvPById = async (req, res) => {
  try {
      await TimerPvP.findByIdAndDelete(req.params.id);
      res.status(204).json();
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
}