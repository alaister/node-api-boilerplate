import { Model } from 'objection'
import { UniqueModel } from '../db/objection'
import BaseModel from './Base'

class Profile extends UniqueModel(['idUser'])(BaseModel) {
  static get tableName() {
    return 'profiles'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['idUser', 'givenName', 'familyName'],
      properties: {
        id: { type: 'string' },
        idUser: { type: 'string' },
        givenName: { type: 'string', minLength: 1, maxLength: 255 },
        familyName: { type: 'string', minLength: 1, maxLength: 255 },
        avatarUrl: { type: 'string' },
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
          from: 'profiles.idUser',
          to: 'users.id',
        },
      },
    }
  }

  static async batchGetById(ids) {
    const profiles = await Profile.query().whereIn('id', ids)
    return ids.map(id => profiles.find(profile => profile.id === id) || null)
  }

  static async batchGetByidUser(idUsers) {
    const profiles = await Profile.query().whereIn('idUser', idUsers)
    return idUsers.map(
      idUser => profiles.find(profile => profile.idUser === idUser) || null
    )
  }
}

export default Profile
