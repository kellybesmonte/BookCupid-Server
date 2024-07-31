import express from 'express';
import * as getBookProfilesByGenre from '../controllers/bookProfilesController.js';

const router = express.Router();


router.get('/book-profiles/genre/:genres', getBookProfilesByGenre);


export default router;


