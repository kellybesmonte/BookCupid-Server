/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('books', function(table) {
        table.increments('id').primary(); 
        table.string('title').notNullable(); 
        table.string('author'); 
        table.text('description');
        table.string('class'); 
        table.json('genres'); 
        table.string('link'); 
        

    });
};



/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('books');
  
};
