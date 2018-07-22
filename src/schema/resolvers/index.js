import merge from 'lodash.merge'

import scalars from './scalars'
import user from './user'
import session from './session'

export default merge({}, scalars, user, session)
