
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
 * Seed function to populate the books table with existing data.
 * @param { import("knex").Knex } knex 
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Select all existing records from the books table
  const existingBooks = await knex("books").select("*");

  // Check if there are existing records to insert
  if (existingBooks.length > 0) {
      console.log("Books table already populated. Skipping seed operation.");
      return; // Exit early if there are already records
  }

  // If no existing records, insert some example data or perform any necessary logic
  console.log("Books table is empty. Inserting initial data...");

  // Example of inserting initial data if the table is empty
  await knex("books").insert([
      { 
          title: "Book Title 1", 
          author: "Author 1", 
          description: "Description 1", 
          class: "Class 1", 
          genres: JSON.stringify(["Genre 1", "Genre 2"]), 
          link: "Link 1" 
      },
      { 
          title: "Book Title 2", 
          author: "Author 2", 
          description: "Description 2", 
          class: "Class 2", 
          genres: JSON.stringify(["Genre 3", "Genre 4"]), 
          link: "Link 2" 
      }
      // Add more records as needed
  ]);

  console.log("Initial data inserted into books table.");
}
