// migrations/20211207150000_create_books_table.js

exports.up = function (knex) {
    return knex.schema.createTable('books', function (table) {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('author').notNullable();
      table.date('read_date'); // Data em que o livro foi lido
      table.text('summary');
      table.text('comment');
      table.integer('rating'); // Nota atribuída ao livro
      table.timestamps(true, true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('books');
  };
  