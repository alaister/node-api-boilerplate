import makeDataloaders from '../dataloaders'

export default function makeDataloadersMiddleware(req, _res, next) {
  req.dataloaders = makeDataloaders(req.actions)

  return next()
}
