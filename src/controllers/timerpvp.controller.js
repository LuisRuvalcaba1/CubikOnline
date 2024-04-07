import TimerPvP from '../models/timerpvp.model.js';

export const createTimerPvP = async (req, res) => {
    try{
        const {time, scramble, winner} = req.body;
        const newTimerPvP = new TimerPvP({
            time,
            scramble,
            winner,
        });
        const savedTimerPvP = await newTimerPvP.save();
        res.json(savedTimerPvP);
    }
    catch (error){
        res.status(500).json({message: error.message});
    }
}

export const getTimersPvP = async (req, res) => {
    try{
        const timers = await TimerPvP.find().populate('winner');
        res.status(200).json(timers);
    }
    catch (error){
        res.status(500).json({message: error.message});
    }
}

export const getTimerPvPById = async (req, res) => {
    try{
        const timer = await TimerPvP.findById(req.params.id);
        if (!timer){
            return res.status(404).json({message: "Timer not found"});
        }
        res.status(200).json(timer);
    }
    catch (error){
        res.status(500).json({message: error.message});
    }
}

export const updateTimerPvPById = async (req, res) => {
    try{
        const {time, scramble, winner} = req.body;
        const updatedTimer = await TimerPvP.findByIdAndUpdate(
            req.params.id,
            {time, scramble, winner},
            {new: true}
        );
        if (!updatedTimer){
            return res.status(404).json({message: "Timer not found"});
        }
        res.status(200).json(updatedTimer);
    }
    catch (error){
        res.status(500).json({message: error.message});
    }
}

export const deleteTimerPvPById = async (req, res) => {
    try{
        const timer = await TimerPvP.findByIdAndDelete(req.params.id);
        if (!timer){
            return res.status(404).json({message: "Timer not found"});
        }
        res.status(200).json({message: "Timer deleted"});
    }
    catch (error){
        res.status(500).json({message: error.message});
    }
}

