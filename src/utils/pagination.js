export async function addPaginationToQuery(
  query,
  { after, first, before, last } = {}
) {
  let hasNextPage = false
  let hasPreviousPage = false

  if (!after && !before && !first && !last) query = query.orderBy('id', 'desc')

  if (after || first) query = query.orderBy('id', 'desc')
  if (before || last) query = query.orderBy('id', 'zsc')

  if (after) query = query.where('id', '<', after)
  if (before) query = query.where('id', '>', before)
  if (first) {
    query = query.limit(first)
    hasPreviousPage = false
    hasNextPage = true
  }
  if (last) {
    query = query.limit(last)
    hasNextPage = false
    hasPreviousPage = true
  }

  const results = await query

  if (first && results.length < first) hasNextPage = false
  if (last && results.length < last) hasPreviousPage = false

  return {
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
    },
    edges: results.map(r => ({ cursor: r.id, node: r })),
  }
}
