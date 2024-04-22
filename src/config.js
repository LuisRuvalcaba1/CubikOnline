import {config} from 'dotenv'
config()
export const DB = process.env.DB
export const PORT = process.env.PORT