import jwt from "jsonwebtoken";
import { DB } from "../config.js";

export const authRequired = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, DB, (err, user) => {
    if (err) return res.status(401).json({ message: "invalidToken" });
    req.user = user;
    next();
  });
};


// export const removeToken = (req, res) => {
//   try {
//     res.clearCookie("token");

//     res.status(200).json({ message: "Token removed and user inactivated" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }

//   res.status(200).json({ message: "Token removed and user inactivated" });
// };

// export const renewToken = (req, res) => {
//   const { token } = req.cookies;
//   if (!token) return res.status(401).json({ message: 'Unauthorized' });

//   jwt.verify(token, DB, (err, user) => {
//     if (err) return res.status(401).json({ message: 'Invalid token' });

//     const newToken = generateToken(user);
//     setTokenCookie(res, newToken);
//     res.status(200).json({ message: 'Token renewed' });
//   });
// };