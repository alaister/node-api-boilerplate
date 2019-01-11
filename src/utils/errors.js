import { ValidationError as ObjectionValidationError } from 'objection'

export class ValidationErrors extends Error {
  constructor(errors) {
    super()
    this.name = 'ValidationErrors'
    this.errors = errors
    this.expose = true
    this.status = 422
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Not Found') {
    super(message)
    this.name = 'NotFoundError'
    this.expose = true
    this.status = 404
  }
}

export class AuthenticationError extends Error {
  constructor(message = 'You must log in to do that') {
    super(message)
    this.name = 'AuthenticationError'
    this.expose = true
    this.status = 401
  }
}

export class AuthorizationError extends Error {
  constructor(message = 'You are not allowed to do that') {
    super(message)
    this.name = 'AuthorizationError'
    this.expose = true
    this.expose = 403
  }
}

export class UnknownError extends Error {
  constructor(message = 'Something went wrong') {
    super(message)
    this.name = 'UnknownError'
    this.expose = true
    this.expose = 500
  }
}

export function formatUserValidationErrors(error) {
  if (error instanceof ObjectionValidationError)
    return {
      userErrors: Object.entries(error.data).flatMap(([key, errors]) =>
        errors.map(error => {
          if (error.keyword === 'unique')
            return {
              field: key.split('.'),
              message: error.message.slice(0, -1),
            }
          else
            return {
              field: key.split('.'),
              message: `${key} ${error.message}`,
            }
        })
      ),
    }
  else if (error instanceof ValidationErrors)
    return { userErrors: error.errors }
  else throw new UnknownError()
}

export async function handleRestErrors(ctx, next) {
  try {
    await next()
  } catch (error) {
    if (error instanceof AuthenticationError) ctx.throw(401)
    else if (error instanceof AuthorizationError) ctx.throw(403)
    else if (error instanceof NotFoundError) ctx.throw(404)
    else {
      /* eslint-disable-next-line no-console */
      console.log('HTTP Error:', error)
      ctx.throw(500)
    }
  }
}

export const graphqlDevErrorLogger = async (_ctx, next) => {
  try {
    await next()
  } catch (error) {
    if (process.env.NODE_ENV !== 'production')
      /* eslint-disable-next-line no-console */
      console.error('GraphQL Error:', error)

    throw error
  }
}
