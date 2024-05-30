import Rank from "../models/rank.model.js";
import User from "../models/user.model.js";

export const getRank = async (req, res) => {
    try {
        const rank = await Rank.find().populate("user", "username");
        res.json(rank);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    }
export const addRank = async (req, res) => {
    try {
        const { user, rank, avg_time } = req.body;
        const newRank = new Rank({ user, rank, avg_time });
        console.log(newRank);
        const savedRank = await newRank.save();
        res.json(savedRank);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}

export const deleteRank = async (req, res) => {
    try {
        const rank = await Rank.findByIdAndDelete(req.params.id);
        if (!rank) return res.status(400).json({ message: "Rank not found" });
        res.json({ message: "Rank deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateRank = async (req, res) => {
    const { rank, avg_time } = req.body;
    try {
        const rankFound = await Rank.findByIdAndUpdate(
            req.params.id,
            { rank, avg_time },
            { new: true }
        );
        if (!rankFound) return res.status(404).json({ message: "Rank not found" });
        res.json(rankFound);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getRankByUser = async (req, res) => {
    try {
        const rank = await Rank.find({ user: req.params.id });
        if (!rank) return res.status(404).json({ message: "Rank not found" });
        res.json(rank);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

