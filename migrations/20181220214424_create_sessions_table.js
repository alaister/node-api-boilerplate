exports.up = function(knex) {
  return knex.schema.createTable('sessions', t => {
    t.uuid('id').primary()
    t.specificType('userId', 'character(25)')
      .notNullable()
      .references('id')
      .inTable('users')
    t.specificType('country', 'character(2)')
      .notNullable()
      .defaultTo('XX')
    t.specificType('ip', 'varchar(45)').notNullable()
    t.timestamp('expires').notNullable()
    t.jsonb('data').nullable()
    t.boolean('deleted')
      .notNullable()
      .defaultTo(false)
    t.timestamp('createdAt')
      .notNullable()
      .defaultTo(knex.fn.now())
    t.timestamp('updatedAt')
      .notNullable()
      .defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('sessions')
}
