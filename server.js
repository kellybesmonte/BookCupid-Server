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
app.get('/quotes/genre/:genres', (req, res) => {
    if (!db) {
        res.status(500).send('Database connection not established');
        return;
    }

    const genres = req.params.genres.split(',').map(genre => genre.trim()); 
    const sql = 'SELECT * FROM quotes WHERE genre IN (?)';
    db.query(sql, [genres], (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (results.length === 0) {
            res.status(404).send('No quotes found for these genres');
        } else {
            res.json(results);
        }
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

