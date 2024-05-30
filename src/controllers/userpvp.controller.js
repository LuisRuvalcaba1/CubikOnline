import UserPvP from "../models/userpvp.model.js";
import mongoose from "mongoose";

export const createUserPvP = async (req, res) => {
  const { user, userPvP, qty_pvp } = req.body;

  try {
    const newUserPvP = new UserPvP({ user, userPvP, qty_pvp });
    await newUserPvP.save();
    res.status(201).json(newUserPvP);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getUserPvP = async (req, res) => {
  try {
    const userPvP = await UserPvP.find();
    res.status(200).json(userPvP);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateUserPvP = async (req, res) => {
  const { id } = req.params;
  const { user, userPvP, qty_pvp } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No userPvP with id: ${id}`);

  const updatedUserPvP = { user, userPvP, qty_pvp, _id: id };

  await UserPvP.findByIdAndUpdate(id, updatedUserPvP, { new: true });

  res.json(updatedUserPvP);
};

export const deleteUserPvP = async (req, res) => {
  try {
    await UserPvP.findByIdAndRemove(req.params.id);
    res.status(204).json();
    console.log("UserPvP deleted successfully.");
  } catch (error) {
    res.json({ message: error.message });
    console.log(error);
  }
};

export const getUserPvPByUser = async (req, res) => {
  try {
    const userPvP = await UserPvP.find({
      $or: [{ user: req.user.id }, { userPvP: req.user.id }],
    })
      .populate("user", "username")
      .populate("userPvP", "username");
    res.status(200).json(userPvP);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
