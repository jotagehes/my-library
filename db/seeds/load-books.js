/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('books').del()
  await knex('books').insert([
    {
      title: "Harry Potter and the Sorcerer's Stone",
      author: 'J.K. Rowling',
      read_date: '2001-05-15',
      summary:
        'The story of a young wizard, Harry Potter, and his adventures at Hogwarts School of Witchcraft and Wizardry.',
      comment: 'Loved it!',
      rating: 5,
    },
    {
      title: 'Harry Potter and the Chamber of Secrets',
      author: 'J.K. Rowling',
      read_date: '2002-03-22',
      summary:
        "The second book in the Harry Potter series, following Harry's second year at Hogwarts.",
      comment: 'Another great installment!',
      rating: 4,
    },
    {
      title: 'Harry Potter and the Prisoner of Azkaban',
      author: 'J.K. Rowling',
      read_date: '2003-09-10',
      summary:
        'The third book in the Harry Potter series, where Harry learns more about his past and the dangerous prisoner Sirius Black.',
      comment: 'Exciting and full of surprises.',
      rating: 5,
    },
    {
      title: 'Harry Potter and the Goblet of Fire',
      author: 'J.K. Rowling',
      read_date: '2005-07-08',
      summary:
        'The fourth book in the Harry Potter series, where Harry competes in the Triwizard Tournament.',
      comment: 'A turning point in the series.',
      rating: 5,
    },
    {
      title: 'Harry Potter and the Order of the Phoenix',
      author: 'J.K. Rowling',
      read_date: '2006-12-19',
      summary:
        'The fifth book in the Harry Potter series, where Harry faces challenges and a dark secret about Voldemort.',
      comment: 'Emotional and intense.',
      rating: 4,
    },
    {
      title: 'Harry Potter and the Half-Blood Prince',
      author: 'J.K. Rowling',
      read_date: '2008-03-30',
      summary:
        "The penultimate book in the series, revealing Voldemort's past and leading to a tragic climax.",
      comment: 'Heartbreaking and suspenseful.',
      rating: 5,
    },
    {
      title: 'Harry Potter and the Deathly Hallows',
      author: 'J.K. Rowling',
      read_date: '2010-06-15',
      summary:
        'The final book in the Harry Potter series, where Harry confronts Voldemort for the last time.',
      comment: 'A satisfying conclusion to the epic saga.',
      rating: 5,
    },
  ])
}
