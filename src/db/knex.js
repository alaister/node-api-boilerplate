import knex from 'knex'

const k = knex({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
})

if (process.env.NODE_ENV !== 'production')
  k.on('query', ({ sql, bindings = [] }) => {
    const stringBindings = bindings.map(b => String(b))
    /* eslint-disable-next-line no-console */
    console.log(
      `Running SQL Query: ${sql
        .split('?')
        .reduce(
          (acc, part, i) =>
            acc + part + String(stringBindings[i] ? stringBindings[i] : ''),
          ''
        )}`
    )
  })

export default k
