import { ValidationError as ObjectionValidationError } from 'objection'

export function ValidationErrors(errors) {
  this.name = 'ValidationErrors'

  this.errors = errors
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

  if (error instanceof ValidationErrors) return { userErrors: error.errors }
}

export async function handleRestErrors(ctx, next) {
  try {
    await next()
  } catch (error) {
    if (error instanceof AuthenticationError) ctx.throw(401)
    else if (error instanceof AuthorizationError) ctx.throw(403)
    else if (error instanceof NotFoundError) ctx.throw(404)
    else ctx.throw(500)
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

export function NotFoundError(message) {
  this.name = 'NotFoundError'
  this.message = message
}

export function AuthenticationError(message) {
  this.name = 'AuthenticationError'
  this.message = 'You must log in to do that' || message
}

export function AuthorizationError(message) {
  this.name = 'AuthorizationError'
  this.message = 'You are not allowed to do that' || message
}
