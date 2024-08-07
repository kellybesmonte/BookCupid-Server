import Knex from 'knex';
import config from './knexfile.js';

const knex = Knex(config);

async function keepAlive() {
  try {
    await knex.raw('SELECT 1');
    console.log('Keep-alive query successful');
  } catch (error) {
    console.error('Keep-alive query failed', error);
  }
}


setInterval(keepAlive, 5 * 60 * 1000);

const db = {
  query: (sql, bindings) => knex.raw(sql, bindings),
};

export default db;
