import TimerPvP from '../models/timerpvp.model';

export const createTimerPvP = async (req, res) => {
    try {
        const { time, scramble, looser, winner } = req.body;
        const newTimerPvP = new TimerPvP({
            time,
            scramble,
            looser,
            winner,
        });

        const savedTimerPvP = await newTimerPvP.save();
        res.json(savedTimerPvP);
        console.log(savedTimerPvP);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getTimersPvP = async (req, res) => {
    try {
        const timers = await TimerPvP.find().populate('looser').populate('winner');
        res.status(200).json(timers);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getTimerPvPById = async (req, res) => {
    try {
        const timer = await TimerPvP.findById(req.params.id);
        if (!timer) {
            return res.status(404).json({ message: "Timer not found" });
        }
        res.status(200).json(timer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateTimerPvPById = async (req, res) => {
    try {
        const { time, scramble, looser, winner } = req.body;
        const updatedTimerPvP = await TimerPvP.findByIdAndUpdate(
            req.user.id,
            { time, scramble, looser, winner },
            { new: true }
        );
        if (!updatedTimerPvP) {
            return res.status(404).json({ message: "Timer not found" });
        }
        res.status(200).json(updatedTimerPvP);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteTimerPvPById = async (req, res) => {
    try {
        const timer = await TimerPvP.findByIdAndDelete(req.params.id);
        if (!timer) {
            return res.status(404).json({ message: "Timer not found" });
        }
        res.status(200).json({ message: "Timer deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getTimerPvPByUser = async (req, res) => {
    try {
        const timers = await TimerPvP.find({ looser: req.user.id }).populate('looser').populate('winner');
        res.status(200).json(timers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getTimerPvPByWinner = async (req, res) => {
    try {
        const timers = await TimerPvP.find({ winner: req.user.id }).populate('looser').populate('winner');
        res.status(200).json(timers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

