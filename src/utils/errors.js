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

export function NotFoundError(message) {
  this.name = 'NotFoundError'
  this.message = message
}

export function AuthenticationError(message) {
  this.name = 'AuthenticationError'
  this.message = 'You must log in to do that' || message
}

export function ForbiddenError(message) {
  this.name = 'ForbiddenError'
  this.message = 'You are not allowed to do that' || message
}
