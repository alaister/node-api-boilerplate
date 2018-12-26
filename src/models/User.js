import { Model } from 'objection'
import { PasswordModel, UniqueModel } from '../db/objection'
import BaseModel from './Base'

class User extends PasswordModel(UniqueModel(['email'])(BaseModel)) {
  static get tableName() {
    return 'users'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        email: {
          type: 'string',
          format: 'email',
          minLength: 1,
          maxLength: 255,
        },
        password: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    }
  }

  static get relationMappings() {
    return {
      sessions: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/Session`,
        join: {
          from: 'users.id',
          to: 'sessions.userId',
        },
      },
    }
  }

  findSessions() {
    return this.$relatedQuery('sessions').whereNotDeleted()
  }
}

export default User
