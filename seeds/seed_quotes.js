
/**
 * 
 * @param { import("knex").Knex } knex 
 * @returns { Promise<void> }
 */
export async function seed(knex) {

  const existingQuotes = await knex("quotes").select("*");


  if (existingQuotes.length === 0) {

      const quotesData = await knex("existing_quotes").select("genre", "quote");


      await knex("quotes").insert(quotesData);
  }
}
