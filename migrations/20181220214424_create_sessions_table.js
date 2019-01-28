exports.up = function(knex) {
  return knex.schema.createTable('sessions', t => {
    t.specificType('id', 'character(25)').primary()
    t.specificType('idUser', 'character(25)').notNullable()
    t.foreign('idUser')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    t.index('idUser')
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
