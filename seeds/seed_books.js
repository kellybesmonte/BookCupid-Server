/**
 * 
 * @param { import("knex").Knex } knex 
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  try {

    const bookProfilesData = await knex("book_profiles").select("book_id", "structured_description");



    console.log("Data fetched successfully:", bookProfilesData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
