import jwt from 'jsonwebtoken';
import { DB } from "../config.js";
export const authRequired = (req, res, next) => {
    const {token} = req.cookies;   
    if(!token) return res.status(401).json({message: 'Unauthorized'})

    jwt.verify(token, DB, (err, user) => {

        if(err) return res.status(401).json({message: 'invalidToken'})
        
        req.user = user;
        next();
    })
};