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
      required: ['email', 'password'],
      properties: {
        id: { type: 'string' },
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
      profile: {
        relation: Model.HasOneRelation,
        modelClass: `${__dirname}/Profile`,
        join: {
          from: 'users.id',
          to: 'profiles.userId',
        },
      },
    }
  }

  static async batchGetById(ids) {
    const users = await User.query().whereIn('id', ids)
    return ids.map(id => users.find(user => user.id === id) || null)
  }
}

export default User
