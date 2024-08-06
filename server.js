import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { knex } from './database.js';

const app = express();

const PORT = process.env.PORT || 8080;
const CROSS_ORIGIN = process.env.CROSS_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(cors({
    origin: CROSS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Main route
app.get('/', (req, res) => {
    res.send('Book Cupid');
});

// Endpoint handlers
app.get('/books/:id', async (req, res) => {
    console.log('Received request for /books/:id with ID:', req.params.id);
    try {
        const id = req.params.id;
        const [results] = await knex('books').where('id', id);

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

// GET ALL QUOTES
app.get('/quotes', async (req, res) => {
    console.log('Received request for /quotes');
    try {
        const [results] = await knex('quotes').select('*');
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
        const results = await knex('quotes').whereIn('genre', genres);

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
app.get('/book_profiles/genre/:genre', async (req, res) => {
    console.log('Received request for /book_profiles/genre/:genre with genre:', req.params.genre);
    try {
        const genre = req.params.genre;

        const results = await knex('books')
            .join('book_profiles', 'books.id', 'book_profiles.book_id')
            .whereRaw('JSON_CONTAINS(books.genre, ?)', [JSON.stringify(genre)])
            .select('books.title', 'books.author', 'book_profiles.book_id', 'book_profiles.structured_description');

        console.log('Query results:', results);

        if (results.length === 0) {
            res.status(404).send('No book profiles found for this genre');
        } else {
            res.json(results);
        }
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Internal server error: ' + err.message);
    }
});

// GET BOOKS BY GENRE
app.get('/books/genre/:genres', async (req, res) => {
    try {
        const genres = req.params.genres.split(',').map(genre => genre.trim());
        const genreConditions = genres.map(() => 'JSON_CONTAINS(genre, ?)').join(' OR ');
        const params = genres.map(genre => JSON.stringify(genre));

        const results = await knex('books').whereRaw(genreConditions, params);

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

// Catch-all for undefined routes
app.use((req, res) => {
    console.log('Route not found:', req.originalUrl);
    res.status(404).send('Route not found');
});

// Initialize database and start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`App is running on port ${PORT}`);
});
