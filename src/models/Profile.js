import { Model } from 'objection'
import { UniqueModel } from '../db/objection'
import BaseModel from './Base'

class Profile extends UniqueModel(['userId'])(BaseModel) {
  static get tableName() {
    return 'profiles'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'givenName', 'familyName'],
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        givenName: { type: 'string', minLength: 1, maxLength: 255 },
        familyName: { type: 'string', minLength: 1, maxLength: 255 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    }
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/User`,
        join: {
          from: 'profiles.userId',
          to: 'users.id',
        },
      },
    }
  }

  static async batchGetById(ids) {
    const profiles = await Profile.query().whereIn('id', ids)
    return ids.map(id => profiles.find(profile => profile.id === id) || null)
  }

  static async batchGetByUserId(userIds) {
    const profiles = await Profile.query().whereIn('userId', userIds)
    return userIds.map(
      userId => profiles.find(profile => profile.userId === userId) || null
    )
  }
}

export default Profile
