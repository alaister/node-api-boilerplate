exports.up = function(knex) {
  return knex.schema.createTable('users', t => {
    t.specificType('id', 'character(25)').primary()
    t.string('name').notNullable()
    t.string('email')
      .notNullable()
      .unique()
    t.string('password').notNullable()
    t.timestamp('createdAt')
      .notNullable()
      .defaultTo(knex.fn.now())
    t.timestamp('updatedAt')
      .notNullable()
      .defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users')
}
