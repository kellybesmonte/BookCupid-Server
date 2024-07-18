/**
 * 
 * @param { import("knex").Knex } knex 
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  try {

    const bookProfilesData = await knex("books").select("id", "title", "author", "description", "class", "genre", "link");
    console.log("Data fetched successfully from books:", bookProfilesData);
  } catch (error) {
    console.error("Error fetching data from books:", error);
  }
}
