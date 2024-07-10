import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Knex instance
const db = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_LOCAL_USER,
        password: process.env.DB_LOCAL_PASSWORD,
        database: process.env.DB_LOCAL_NAME,
        port: process.env.DB_PORT || 3306,
    },
});

async function fetchData(tableName) {
    try {
        const results = await db(tableName).select('*');
        console.log(`Results from ${tableName} table:`, results);

    } catch (err) {
        console.error(`Error querying ${tableName}:`, err);
    }
}


const tables = ['books', 'quotes', 'book_profiles'];

tables.forEach((tableName) => {
    fetchData(tableName);
});