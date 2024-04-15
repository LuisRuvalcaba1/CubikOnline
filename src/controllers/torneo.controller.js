import Torneo from "../models/torneo.model.js";
import mongoose from "mongoose";

export const createTorneo = async (req, res) => {
    try {
        const { nombre, qty_participantes, rango, premio } = req.body;
        const torneo = await Torneo.create({ nombre, qty_participantes, rango, premio });
        res.status(201).json(torneo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getTorneoById = async (req, res) => {
    try {
        const torneo = await Torneo.findById(req.params.id);
        res.status(200).json(torneo);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateTorneoById = async (req, res) => {
    try {
        await Torneo.findByIdAndUpdate
            (req.params.id, req.body);
        res.status(204).json();
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deleteTorneoById = async (req, res) => {
    try {
        await Torneo.findByIdAndDelete(req.params.id);
        res.status(204).json();
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getTorneos = async (req, res) => {
    try {
        const torneos = await Torneo.find();
        res.status(200).json(torneos);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}