import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mysql from 'mysql2/promise';
import * as bookProfilesRouter from './routes/book_profiles.routes.js';

const app = express();

const PORT = process.env.PORT || 8080;
const CROSS_ORIGIN = process.env.CROSS_ORIGIN || 'http://localhost:5173';

let db;

// Initialize database connection
async function initializeDatabase() {
    const maxRetries = 5;
    const retryDelay = 2000; // 2 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const dbUrl = process.env.DATABASE_URL;
            if (!dbUrl) {
                throw new Error('DATABASE_URL is not set');
            }

            const params = new URL(dbUrl);

            const user = params.username;
            const password = params.password;
            const database = params.pathname.slice(1);
            const host = params.hostname;
            const port = params.port || 3306;

            console.log(`Connecting to database at ${host}:${port} as ${user}`);
            console.log(`Database name: ${database}`);

            db = await mysql.createConnection({
                host: host,
                user: user,
                password: password,
                database: database,
                port: port,
                connectTimeout: 10000, // 10 seconds timeout
            });

            console.log('Connected to the database');
            break; // Exit the loop if connection is successful
        } catch (err) {
            console.error(`Attempt ${attempt} - Error connecting to the database:`, err.message);

            if (attempt === maxRetries) {
                console.error('Max retries reached. Exiting process.');
                process.exit(1);  // Exit the process if database connection fails after max retries
            }

            console.log(`Retrying in ${retryDelay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
}

// Middleware
app.use(cors({
    origin: CROSS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api', bookProfilesRouter);

// Main route
app.get('/', (req, res) => {
    res.send('Book Cupid');
});

// Endpoint handlers
app.get('/books/:id', async (req, res) => {
    console.log('Received request for /books/:id with ID:', req.params.id);
    try {
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
    console.log('Received request for /books/genre/:genres with genres:', req.params.genres);
    try {
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
    console.log('Received request for /quotes');
    try {
        const [results] = await db.query('SELECT * FROM quotes');
        res.json(results);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Internal server error: ' + err.message);
    }
});

// GET QUOTES BY GENRE
app.get('/quotes/genre/:genres', async (req, res) => {
    console.log('Received request for /quotes/genre/:genres with genres:', req.params.genres);
    try {
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

//GET BOOK PROFILES
app.get('/book_profiles/genre/:genres', async (req, res) => {
    console.log('Received request for /book_profiles/genre/:genres with genres:', req.params.genres);
    try {
        const genres = req.params.genres.split(',').map(genre => genre.trim());
        const sql = 'SELECT * FROM book_profiles WHERE genre IN (?)';
        const results = await db.raw(sql, [genres]);

        if (results.rows.length === 0) {
            res.status(404).send('No book profiles found for these genres');
        } else {
            res.json(results.rows);
        }
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Internal server error: ' + err.message);
    }
});

// GET STRUCTURED BOOK DESCRIPTION
app.get('/book_profiles/:id', async (req, res) => {
    console.log('Received request for /book-profiles/:id with ID:', req.params.id);
    try {
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

// Catch-all for undefined routes
app.use((req, res) => {
    console.log('Route not found:', req.originalUrl);
    res.status(404).send('Route not found');
});

// Initialize database and start server
initializeDatabase().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`App is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize the database:', err.message);
});
