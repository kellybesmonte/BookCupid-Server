
import knex from 'knex'; 
/**
 * =
 * 
 * @param { import("knex").Knex } knex 
 * @returns { Promise<void> }
 */
export const up = function(knex) {
    return knex.schema.createTableIfNotExists("books", function(table) {
        // Define table columns
        table.increments("id").primary();
        table.string("title").notNullable();
        table.string("author");
        table.text("description");
        table.string("class");
        table.json("genres");
        table.string("link");
    });
};

/**

 * 
 * @param { import("knex").Knex } knex 
 * @returns { Promise<void> }
 */
export const down = function(knex) {
    return knex.schema.dropTableIfExists("books");
};
