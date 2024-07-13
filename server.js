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
            database: process.env.DB_LOCAL_NAME
        });

        console.log('Connected to the database');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

initializeDatabase(); 

app.use(cors({
    origin: CROSS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api', bookProfilesRouter);

// ROUTES //

app.get('/', (req, res) => {
    res.send('Book Cupid');
});

// GET BOOK BY ID
app.get('/books/:id', (req, res) => {
    if (!db) {
        res.status(500).send('Database connection not established');
        return;
    }

    const id = req.params.id;
    db.query('SELECT * FROM books WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send(err.message);
        } else if (results.length === 0) {
            res.status(404).send('No book found for this ID');
        } else {
            res.json(results[0]); 
        }
    });
});

// GET BOOKS BY GENRE
app.get('/books/genre/:genres', (req, res) => {
    if (!db) {
        res.status(500).send('Database connection not established');
        return;
    }

    const genres = req.params.genres.split(',').map(genre => genre.trim());

    const genreConditions = genres.map(() => 'JSON_CONTAINS(genres, ?)').join(' OR ');
    const sql = `SELECT * FROM books WHERE ${genreConditions}`;


    const params = genres.map(genre => JSON.stringify([genre]));

    console.log(`SQL Query: ${sql}`);
    console.log(`Params: ${params}`);

    db.query(sql, params, (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (results.length === 0) {
            res.status(404).send('No books found for these genres');
        } else {
            res.json(results);
        }
    });
});




//GET ALL QUOTES 
app.get('/quotes', (req, res) => {
    if (!db) {
        res.status(500).send('Database connection not established');
        return;
    }

    const sql = 'SELECT * FROM quotes';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(results);
        }
    });
});

//GET QUOTES BY GENRE
// GET BOOKS BY GENRE
app.get('/books/genre/:genres', (req, res) => {
    if (!db) {
        res.status(500).send('Database connection not established');
        return;
    }

    const genres = req.params.genres.split(',').map(genre => genre.trim());

    // Constructing a SQL query with JSON_CONTAINS_PATH for each genre
    const genreConditions = genres.map(() => 'JSON_CONTAINS_PATH(genres, "one", ?)').join(' OR ');
    const sql = `SELECT * FROM books WHERE ${genreConditions}`;

    // Preparing parameters for JSON_CONTAINS_PATH
    const params = genres.map(genre => `$.${genre}`);

    console.log(`SQL Query: ${sql}`);
    console.log(`Params: ${params}`);

    db.query(sql, params)
        .then(([results]) => {
            if (results.length === 0) {
                res.status(404).send('No books found for these genres');
            } else {
                res.json(results);
            }
        })
        .catch(err => {
            console.error('Database query error:', err);
            res.status(500).send('Internal server error: ' + err.message);
        });
});




// GET STRUCTURED BOOK DESCRIPTION
app.get('/book_profiles/:id', (req, res) => {
    if (!db) {
        res.status(500).send('Database connection not established');
        return;
    }

    const id = req.params.id;
    db.query(`
        SELECT b.title, b.author, bp.structured_description
        FROM books b
        JOIN book_profiles bp ON b.id = bp.book_id
        WHERE b.id = ?`, [id], (err, results) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(results);
            }
        });
});



app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});

