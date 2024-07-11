
import express from 'express';
const router = express.Router();
const db = require('./db'); 





router.get('/book-profiles/genre/:genre', async (req, res) => {
    const { genre } = req.params;

    try {
        const results = await db.query(
            `SELECT bp.*, b.genre 
            FROM book_profiles bp 
            JOIN books b ON bp.book_id = b.id 
            WHERE JSON_CONTAINS(b.genre, JSON_QUOTE(?))`, 
            [genre]
        );
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
