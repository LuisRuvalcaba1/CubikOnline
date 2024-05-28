import jwt from "jsonwebtoken";
import { DB } from "../config.js";

export const authRequired = (req, res, next) => {
  // Obtener el token del encabezado de autorización
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, DB, (err, user) => {
    if (err) return res.status(401).json({ message: "invalidToken" });
    req.user = user;
    next();
  });
};

export const removeToken = (req, res) => {
  try {
    res.clearCookie("token");

    res.status(200).json({ message: "Token removed and user inactivated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.status(200).json({ message: "Token removed and user inactivated" });
};
