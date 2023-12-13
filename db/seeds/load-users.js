/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  return knex('users')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          name: 'João Hespanhol',
          email: 'john.doe@tuamaeaquelaursa.com',
          password:
            '$2a$08$tprzZIs1OTKVMaVzZWrKfe8rX3toatWD6lsvp4u9AR54mrbSSLX7e',
          role: 'user',
        },
        {
          name: 'Rommel Puc',
          email: 'rommel_puc@tuamaeaquelaursa.com',
          password:
            '$2a$08$tprzZIs1OTKVMaVzZWrKfe8rX3toatWD6lsvp4u9AR54mrbSSLX7e',
          role: 'admin',
        },
      ])
    })
}
