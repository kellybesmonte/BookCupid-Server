

/**
 * =
 * 
 * @param { import("knex").Knex } knex 
 * @returns { Promise<void> }
 */
export const up = function(knex) {
    return knex.schema.createTableIfNotExists("quotes", function(table) {
        // Define table columns
        table.increments("id").primary();
        table.string("genre").notNullable();
        table.string("quote");
    });
};

/**

 * 
 * @param { import("knex").Knex } knex 
 * @returns { Promise<void> }
 */
export const down = function(knex) {
    return knex.schema.dropTableIfExists("quotes");
};
