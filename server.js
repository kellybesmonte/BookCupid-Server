import express from 'express';
import cors from 'cors'
import 'dotenv/config';


const app = express();
const PORT = process.env.PORT || 8082;
const CROSS_ORIGIN = process.env.CROSS_ORIGIN || '*';

app.use(cors({ origin: CROSS_ORIGIN }));
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
