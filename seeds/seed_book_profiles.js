/**

 * 
 * @param { import("knex").Knex } knex 
 * @returns { Promise<void> }
 */
export async function seed(knex) {

  const existingBookProfiles = await knex("book_profiles").select("*");


  if (existingBookProfiles.length === 0) {

      const bookProfilesData = await knex("existing_book_profiles").select("book_id", "description");

      await knex("book_profiles").insert(bookProfilesData);
  }
}

