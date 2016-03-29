import {omit, merge, pick, filter} from 'ramda'

export let queryOptions = ['sort', 'limit', 'skip']

/**
 * Get conditions object from query for Mongoose.Model.find()
 *
 * @param {Object} query Parsed from the hitted URL
 * @param {Object} [options] Default conditions
 * @returns {Object} Conditions for mongoose query
 */
export function getConditions(query, options) {
  let conditions = omit(queryOptions, query)

  /**
   * Merges query objects with default options
   *
   * To select any value of a field we have left the key out of an object
   * To rewrite defaults we have to omit the chosen 'any' value from the object.
   *
   * @returns object to be inserted into Mongoose query
   */
  let isAny = value => {
    if (value === 'any') {
      return false
    }
    return true
  }

  return filter(isAny, merge(options, conditions))
}

/**
 * Returns object of options for Mongoose.Model.find() from query
 *
 * @see http://mongoosejs.com/docs/api.html#query_Query-setOptions
 * @param
 * @returns
 */
export function getOptions(query, options) {
  // Select options from query
  let selectedOptions = pick(queryOptions, query)

  // Return selected options from query. Set defaults
  return merge(options, selectedOptions)
}
