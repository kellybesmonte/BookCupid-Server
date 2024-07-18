import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mysql from 'mysql2';
import bookProfilesRouter from './routes/book_profiles.routes.js';

const app = express();
const PORT = process.env.PORT || 8082;
const CROSS_ORIGIN = process.env.CROSS_ORIGIN || 'http://localhost:5173';

let db;



async function initializeDatabase() {
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_LOCAL_USER,
            password: process.env.DB_LOCAL_PASSWORD,
            database: process.env.DB_LOCAL_NAME,

        }).promise(); 

        console.log('Connected to the database');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

initializeDatabase();

// Middleware
app.use(cors({
    origin: CROSS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api', bookProfilesRouter);



app.get('/books/:id', async (req, res) => {
    try {
        if (!db) {
            res.status(500).send('Database connection not established');
            return;
        }

        const id = req.params.id;
        const [results] = await db.query('SELECT * FROM books WHERE id = ?', [id]);

        if (results.length === 0) {
            res.status(404).send('No book found for this ID');
        } else {
            res.json(results[0]);
        }
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Internal server error: ' + err.message);
    }
});

// GET BOOKS BY GENRE
app.get('/books/genre/:genres', async (req, res) => {
    try {
        if (!db) {
            res.status(500).send('Database connection not established');
            return;
        }
        const genres = req.params.genres.split(',').map(genre => genre.trim());
        const genreConditions = genres.map(() => 'JSON_CONTAINS(genre, ?)').join(' OR ');
        const sql = `SELECT * FROM books WHERE ${genreConditions}`;
        const params = genres.map(genre => JSON.stringify(genre));

        const [results] = await db.query(sql, params);

        if (results.length === 0) {
            res.status(404).send('No books found for these genres');
        } else {
            res.json(results);
        }
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Internal server error: ' + err.message);
    }
});

// GET ALL QUOTES
app.get('/quotes', async (req, res) => {
    try {
        if (!db) {
            res.status(500).send('Database connection not established');
            return;
        }

        const [results] = await db.query('SELECT * FROM quotes');
        res.json(results);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Internal server error: ' + err.message);
    }
});

// GET QUOTES BY GENRE
app.get('/quotes/genre/:genres', async (req, res) => {
    try {
        if (!db) {
            res.status(500).send('Database connection not established');
            return;
        }

        const genres = req.params.genres.split(',').map(genre => genre.trim());
        const sql = 'SELECT * FROM quotes WHERE genre IN (?)';
        const [results] = await db.query(sql, [genres]);

        if (results.length === 0) {
            res.status(404).send('No quotes found for these genres');
        } else {
            res.json(results);
        }
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Internal server error: ' + err.message);
    }
});

// GET STRUCTURED BOOK DESCRIPTION
app.get('/book_profiles/:id', async (req, res) => {
    try {
        if (!db) {
            res.status(500).send('Database connection not established');
            return;
        }

        const id = req.params.id;
        const [results] = await db.query(`
            SELECT b.title, b.author, bp.structured_description
            FROM books b
            JOIN book_profiles bp ON b.id = bp.book_id
            WHERE b.id = ?`, [id]);

        if (results.length === 0) {
            res.status(404).send('No book profile found for this ID');
        } else {
            res.json(results[0]);
        }
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Internal server error: ' + err.message);
    }
});


// ROUTES
app.get('/', (req, res) => {
    res.send('Book Cupid');
});


app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
