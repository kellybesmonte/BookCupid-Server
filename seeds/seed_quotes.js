/**
 * 
 * @param { import("knex").Knex } knex 
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  try {

    const quotesData = await knex("quotes").select("genre", "quote");


    console.log("Quotes fetched successfully:", quotesData);
  } catch (error) {
    console.error("Error fetching quotes data:", error);
  }
}

