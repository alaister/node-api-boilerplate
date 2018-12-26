import { connectionDefinitions } from 'graphql-relay'
import Session from './Session'

const { connectionType: SessionConnection } = connectionDefinitions({
  nodeType: Session,
})

export default SessionConnection
