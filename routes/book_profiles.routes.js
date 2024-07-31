import express from 'express';
import configuration from '../knexfile.js';
import initKnex from 'knex'; 

const knex = initKnex(configuration);
const router = express.Router();

router.get('/book_profiles/genre/:genres', async (req, res) => {
    console.log('Received request for /book-profiles/genre/:genres with genres:', req.params.genres);
    try {
        const genres = req.params.genres.split(',').map(genre => genre.trim());
        const sql = 'SELECT * FROM book_profiles WHERE genre IN (?)';
        const [results] = await db.query(sql, [genres]);

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

// router.get('/book_profiles/genre/:genre', async (req, res) => {
//     const { genre } = req.params;

//     try {
//         const results = await knex('book_profiles as bp')
//             .join('books as b', 'bp.book_id', 'b.id')
//             .whereRaw('JSON_CONTAINS(b.genre, JSON_QUOTE(?))', [genre])
//             .select('bp.*', 'b.genre');

//         if (results.length === 0) {
//             return res.status(404).json({ error: 'No book profiles found for this genre' });
//         }

//         res.json(results);
//     } catch (error) {
//         console.error('Error fetching book profiles:', error);
//         res.status(500).json({ error: 'Internal server error', message: error.message });
//     }
// });

// export default router;


