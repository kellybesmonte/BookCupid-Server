
// /**
//  * 
//  * @param { import("knex").Knex } knex 
//  * @returns { Promise<void> }
//  */
// export async function seed(knex) {

//   const existingBooks = await knex("books").select("*");


//   await knex("books").insert(existingBooks);
// }


/**
 * 
 * @param { import("knex").Knex } knex 
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  try {
    // Fetch data from existing_book_profiles table
    const bookProfilesData = await knex("book_profiles").select("book_id", "structured_description");

    // Log or process the fetched data (example: console.log(bookProfilesData))

    // Ensure no unintended data modification operations are performed here

    console.log("Data fetched successfully:", bookProfilesData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
