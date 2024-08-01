import express from 'express';
import knexConfig from '../knexfile.js'; 
import knex from 'knex';

const db = knex(knexConfig); 
const router = express.Router();

router.get('/book_profiles/genre/:genres', async (req, res) => {
    console.log('Received request for /book_profiles/genre/:genres with genres:', req.params.genres);
    try {
        const genres = req.params.genres.split(',').map(genre => genre.trim());


        const results = await db('book_profiles as bp')
            .join('books as b', 'bp.book_id', 'b.id')
            .whereRaw('JSON_CONTAINS(b.genre, ?, ?)', [JSON.stringify(genres), '$'])
            .select('bp.id', 'bp.book_id', 'b.genre');

        if (results.length === 0) {
            res.status(404).send('No book profiles found for these genres');
        } else {
            res.json(results);
        }
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Internal server error: ' + err.message);
    }
});

export default router;
