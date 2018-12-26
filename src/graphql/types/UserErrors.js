import { GraphQLList, GraphQLNonNull } from 'graphql'
import UserError from './UserError'

const UserErrors = GraphQLNonNull(GraphQLList(GraphQLNonNull(UserError)))

export default UserErrors
