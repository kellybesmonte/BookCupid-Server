import express from 'express';
import configuration from '../knexfile.js';
import initKnex from 'knex'; 

const knex = initKnex(configuration);
const router = express.Router();

router.get('/book-profiles/genre/:genre', async (req, res) => {
    const { genre } = req.params;

    try {
        const results = await knex('book_profiles as bp')
            .join('books as b', 'bp.book_id', 'b.id')
            .whereRaw('JSON_CONTAINS(b.genre, JSON_QUOTE(?))', [genre])
            .select('bp.*', 'b.genre');
        
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

