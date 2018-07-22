import {
  ApolloError,
  AuthenticationError as ApolloAuthenticationError,
  ForbiddenError as ApolloForbiddenError,
} from 'apollo-server-express'

export function ValidationError(error) {
  this.name = 'ValidationError'

  if (error.length) {
    this.errors = error
  } else if (typeof error === 'object') {
    if (error.errors && !error.errors.length) {
      this.errors = Object.values(error.errors).map(err => ({
        message: err.message,
        field: err.path.split('.'),
      }))
    } else {
      this.errors = [error]
    }
  } else {
    this.errors = []
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

export function ForbiddenError(message) {
  this.name = 'ForbiddenError'
  this.message = 'You are not allowed to do that' || message
}

export function handleUserErrors(err) {
  if (err instanceof ValidationError) {
    return { userErrors: err.errors }
  } else if (err instanceof NotFoundError) {
    throw new ApolloError(err.message, 'NOT_FOUND')
  } else if (err instanceof AuthenticationError) {
    throw new ApolloAuthenticationError(err.message)
  } else if (err instanceof ForbiddenError) {
    throw new ApolloForbiddenError(err.message)
  } else {
    throw err
  }
}

export function handleRestErrors(res, err) {
  if (err instanceof ValidationError) {
    res.status(422).send({ message: 'Invalid input data', errors: err.errors })
  } else if (err instanceof NotFoundError) {
    res.status(404).send({ message: err.message })
  } else if (err instanceof AuthenticationError) {
    res.status(401).send({ message: err.message })
  } else if (err instanceof ForbiddenError) {
    res.status(403).send({ message: err.message })
  } else {
    let error

    if (process.env.NODE_ENV !== 'production') {
      error = err
    }

    res.status(500).send({ message: 'Something went wrong', error })
  }
}
