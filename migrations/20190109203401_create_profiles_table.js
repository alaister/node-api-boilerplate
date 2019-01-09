exports.up = function(knex) {
  return knex.schema.createTable('profiles', t => {
    t.specificType('id', 'character(25)').primary()
    t.specificType('accountId', 'character(25)')
      .notNullable()
      .unique()
    t.foreign('accountId')
      .references('id')
      .inTable('accounts')
      .onDelete('CASCADE')
    t.string('givenName').notNullable()
    t.string('familyName').notNullable()
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