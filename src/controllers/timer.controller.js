import TimerModel from "../models/timer.model.js";

export const createTimer = async (req, res) => {
  try {
    const { time, scramble, session, user } = req.body;
    const newTimer = new TimerModel({
      time,
      scramble,
      session,
      user,
    });

    const savedTimer = await newTimer.save();
    res.json(savedTimer);
    console.log(savedTimer);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const getTimers = async (req, res) => {
  try {
    const timers = await TimerModel.find({ user: req.user.id }).populate("user");
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
    const { time, scramble, session } = req.body;
    const updatedTimer = await TimerModel.findByIdAndUpdate(
      req.user.id,
      { time, scramble, session },
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
