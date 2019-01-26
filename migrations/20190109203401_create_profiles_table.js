exports.up = function(knex) {
  return knex.schema.createTable('profiles', t => {
    t.specificType('id', 'character(25)').primary()
    t.specificType('userId', 'character(25)')
      .notNullable()
      .unique()
    t.foreign('userId')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    t.string('givenName').notNullable()
    t.string('familyName').notNullable()
    t.string('avatarUrl').nullable()
    t.timestamp('createdAt')
      .notNullable()
      .defaultTo(knex.fn.now())
    t.timestamp('updatedAt')
      .notNullable()
      .defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('profiles')
}
