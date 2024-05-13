import {config} from 'dotenv'
config()
export const DB = process.env.DB
export const PORT = process.env.PORT
export const CLIENT = process.env.CLIENT
export const TOKEN_SECRET = process.env.TOKEN_SECRET
