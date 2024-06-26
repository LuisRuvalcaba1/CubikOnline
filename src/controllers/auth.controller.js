import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { DB } from "../config.js";

export const register = async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["The email is already in use"]);

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      password: passwordHash,
      points: 0,
      role: "user",
      status: "active",
      verificado: false,
      tokenVerificacion: null,
      isPrivate: false,
    });

    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id });
    res.json({
      token,
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

    res.json({
      token,
      _id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      points: userFound.points,
      status: userFound.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const getUserByEmail = async (email) => {
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
    }
    return userFound;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const statusChange = async (req, res) => {
  const { email, status, role } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json({ message: "User not found" });
    userFound.status = status;
    userFound.role = role;
    await userFound.save();
    res.json(userFound);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeToJugde = async (req, res) => {
  const { email, role } = req.body;
  try {
    const userToChange = await User.findOne({ email });
    if (!userToChange)
      return res.status(400).json({ message: "User not found" });
    userToChange.role = role;
    await userToChange.save();
    res.json(userToChange);
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
    status: userFound.status,
  });
};

export const verifyToken = async (req, res) => {
  const authHeader = req.headers.authorization; // Obteniendo el encabezado de autorización

  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1]; // Extrayendo el token del encabezado de autorización

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, DB, async (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "Unauthorized" });

    return res.json({
      _id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      points: userFound.points,
      status: userFound.status,
      isPrivate: userFound.isPrivate,
    });
  });
};

export const isPrivate = async (req, res) => {
  const { email, isPrivate } = req.body;
  try {
    const userPrivate = await User.findOne({ email });
    userPrivate.isPrivate = isPrivate;
    await userPrivate.save();
    if (!userPrivate)
      return res.status(404).json({ message: "User not found" });
    res.json(userPrivate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserPrivateStatus = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ isPrivate: user.isPrivate });
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
  const { points } = req.body;
  try {
    const userFound = await User.findByIdAndUpdate(
      req.params.id,
      { points },
      { new: true }
    );
    if (!userFound) return res.status(404).json({ message: "User not found" });
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
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!userFound) return res.status(404).json({ message: "User not found" });
    res.json(userFound);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().limit(10);
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};