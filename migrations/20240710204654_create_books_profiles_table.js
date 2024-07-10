

/**
 * 
 * 
 * @param { import("knex").Knex } knex - Knex instance for executing SQL queries.
 * @returns { Promise<void> }
 */
export const up = function(knex) {
    return knex.schema.createTable("book_profiles", function(table) {
        table.increments("id").primary();
        table.integer("book_id").unsigned().notNullable();
        table.foreign("book_id").references("id").inTable("books").onDelete("CASCADE");
        table.text("description");
    });
};

/**
 * 
 * 
 * @param { import("knex").Knex } knex - Knex instance for executing SQL queries.
 * @returns { Promise<void> }
 */
export const down = function(knex) {
    return knex.schema.dropTableIfExists("book_profiles");
};
