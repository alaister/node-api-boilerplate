export const authn = next => (root, args, context, info) => {
  if (!context.currentUser) throw new Error('Not Authenticated')

  return next(root, args, context, info)
}

export const authzPre = (next, ...rules) => async (
  root,
  args,
  context,
  info
) => {
  await Promise.all(
    rules.map(rule => Promise.resolve(rule(root, args, context, info)))
  )

  return next(root, args, context, info)
}

export const authzPost = (resolver, ...rules) => async (
  root,
  args,
  context,
  info
) => {
  const result = await Promise.resolve(resolver(root, args, context, info))

  await Promise.all(
    rules.map(rule => Promise.resolve(rule(result, args, context, info)))
  )

  return result
}
