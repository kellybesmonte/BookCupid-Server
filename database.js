import Knex from 'knex';
import retry from 'async-retry';
import knexConfig from './knexfile.js';


const knex = Knex(knexConfig);


async function connectWithRetry() {
  await retry(async () => {
    await knex.raw('SELECT 1');
  }, {
    retries: 5,
    minTimeout: 1000,
    onRetry: (err, attempt) => {
      console.log(`Retrying connection attempt ${attempt} after error: ${err.message}`);
    }
  });
}


setInterval(() => {
  knex.raw('SELECT 1').catch(err => console.error('Keep-alive query failed', err));
}, 60000); 


connectWithRetry().catch(err => console.error('Failed to establish database connection', err));

async function queryWithRetry(query) {
  return retry(async () => {
    return await knex.raw(query);
  }, {
    retries: 5,
    minTimeout: 1000,
    onRetry: (err, attempt) => {
      console.log(`Retrying query attempt ${attempt} after error: ${err.message}`);
    }
  });
}

export { knex, queryWithRetry };
