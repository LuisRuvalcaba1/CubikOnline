import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { DB } from "../config.js";
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["The email is already in use"]);

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: passwordHash,
      points: 0,
      role: "user",
      status: "active",
      rank: 0,
    });

    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id });
    res.cookie("token", token);
    res.json({
      _id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = await createAccessToken({ id: userFound._id });
    res.cookie("token", token, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });
    res.json({
      _id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      points: userFound.points,
      rank: userFound.rank,
      status: userFound.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const statusChange = async (req, res) => {
  const { email, status } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json({ message: "User not found" });
    userFound.status = status;
    await userFound.save();
    res.json(userFound);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const changeToJugde = async (req, res) => {
  const { email, role } = req.body;
  try {
    const userToChange = await User.findOne({ email});
    if (!userToChange) return res.status(400).json({ message: "User not found" });
    userToChange.role = role;
    userToChange.save();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);
  if (!userFound) return res.status(400).json({ message: "User not found" });
  return res.json({
    _id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    points: userFound.points,
    rank: userFound.rank,
    status: userFound.status,
  });
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, DB, async (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "Unauthorized" });

    return res.json({
      _id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
};

export const updateUser = async (req, res) => {
  try {
    const userFound = User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!userFound) return res.status(404).json({ message: "User not found" });
    res.json(userFound);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(400).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserPoints = async (req, res) => {
  const { points, email } = req.body;
  try {
    const userFound = await User.findOne({ email })
    if (!userFound) return res.status(404).json({ message: "User not found" });
    userFound.points = points;
    await userFound.save();
    res.json(userFound);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json({ message: "User not found" });
    const passwordHash = await bcrypt.hash(newPassword, 10);
    userFound.password = passwordHash;
    await userFound.save();
    res.json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const userFound = await User.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true });
    if (!userFound) return res.status(404).json({ message: "User not found" });
    res.json(userFound);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};