import makeUserActions from './user'
import makeSessionActions from './session'

export default function makeActions(currentUser) {
  return {
    user: makeUserActions(currentUser),
    session: makeSessionActions(currentUser),
  }
}
