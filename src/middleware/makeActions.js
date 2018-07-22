import makeActions from '../actions'

export default function makeActionsMiddleware(req, _res, next) {
  req.actions = makeActions(req.user)

  return next()
}
