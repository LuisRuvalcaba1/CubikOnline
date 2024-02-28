import TimerModel from "../models/timer.model.js";

export const createTimer = async (req, res) => {
    try {
      const { time, user, scramble, session } = req.body;
      const newTimer = new TimerModel({
        time,
        scramble,
        session,
      });
      
      const savedTimer = await newTimer.save();
      res.status(201).json({
        _id : savedTimer._id,
        time: savedTimer.time,
        scramble: savedTimer.scramble,
        session: savedTimer.session,
      });

      console.log(savedTimer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const getTimers = async (req, res) => {
    try {
      const timers = await TimerModel.find();
      res.status(200).json(timers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const getTimerById = async (req, res) => {
    try {
      const timer = await TimerModel.findById(req.params.id);
      if (!timer) {
        return res.status(404).json({ message: "Timer not found" });
      }
      res.status(200).json(timer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const updateTimerById = async (req, res) => {
    try {
      const { time, user, scramble, session } = req.body;
      const updatedTimer = await TimerModel.findByIdAndUpdate(
        req.params.id,
        { time, user, scramble, session },
        { new: true }
      );
      if (!updatedTimer) {
        return res.status(404).json({ message: "Timer not found" });
      }
      res.status(200).json(updatedTimer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const deleteTimerById = async (req, res) => {
    try {
      const deletedTimer = await TimerModel.findByIdAndDelete(req.params.id);
      if (!deletedTimer) {
        return res.status(404).json({ message: "Timer not found" });
      }
      res.status(200).json({ message: "Timer deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };