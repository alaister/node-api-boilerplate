import cuid from 'cuid'
import objectionGuid from 'objection-guid'
import objectionPassword from 'objection-password'
import objectionSoftDelete from 'objection-soft-delete'
import objectionUnique from 'objection-unique'

/**
 * Password model decorator that automatically hashes a .password field on a model
 */
export const PasswordModel = objectionPassword({ rounds: 13 })

/**
 * CUID model decorator that automatically generates a cuid for the .id field
 */
export const CuidModel = objectionGuid({ generateGuid: cuid })

/**
 * Unique model decorator that handles unique constraint errors gracefully
 * @param {string[]} fields List of fields that have unique constraints
 * @returns {Model} Model decorator
 */
export const UniqueModel = fields => objectionUnique({ fields })

/**
 * Soft delete model decorator handles model soft deleting functionality
 */
export const SoftDelete = objectionSoftDelete({ columnName: 'deleted' })
