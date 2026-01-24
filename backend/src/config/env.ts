import dotenv from 'dotenv';
dotenv.config();


const MONGO_URI = process.env.MONGO_URI || "NO STRING"
const REFRESH_SECRET = process.env.REFRESH_SECRET || "NO SECRET"
const ACCESS_SECRET = process.env.ACCESS_SECRET || "NO SECRET"
const LOG_LEVEL = process.env.LOG_LEVEL || "info"
const NODE_ENV = process.env.NODE_ENV || 'dev'
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5000'

export  {MONGO_URI, REFRESH_SECRET, ACCESS_SECRET, LOG_LEVEL, NODE_ENV, CLIENT_URL };
