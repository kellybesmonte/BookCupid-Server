import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mysql from 'mysql2';

const app = express();
const PORT = process.env.PORT || 8082;
const CROSS_ORIGIN = process.env.CROSS_ORIGIN || '*';

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

app.use(cors({ origin: CROSS_ORIGIN }));
app.use(express.json());

// ROUTES //

app.get('/', (req, res) => {
    res.send('Book Cupid');
});

// GET GENRES
// app.get('/genres', (req, res) => {
//     if (!db) {
//         res.status(500).send('Database connection not established');
//         return;
//     }

//     db.query('SELECT * FROM genres', (err, results) => {
//         if (err) {
//             res.status(500).send(err);
//         } else {
//             res.json(results);
//         }
//     });
// });

// GET QUOTES BY GENRE
app.get('/quotes/:genre', (req, res) => {
    if (!db) {
        res.status(500).send('Database connection not established');
        return;
    }

    const genre = req.params.genre;
    db.query('SELECT * FROM quotes WHERE genre = ?', [genre], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
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
            res.status(500).send(err);
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

