import test from 'tape'
import {getConditions, getOptions} from './index'

let defaultConditions = {
  state: 'Published',
  type: 'classic'
}

let defaultOptions = {
  limit: 10,
  sort: 'createdDate'
}

test('QueryParser', t => {
  t.deepEqual(
    getConditions({}, defaultConditions),
    defaultConditions,
    'getConditions should return defaults when query is empty'
  )

  t.test('getConditions should rewrite defaults when query is set', subtest => {
    let query = {
      state: 'Draft'
    }
    let conditions = getConditions(query, defaultConditions)
    subtest.equal(
      conditions.state, 'Draft', 'Shows rewritten state'
    )
    subtest.equal(
      conditions.type, 'classic', 'Shows default option type'
    )
    subtest.end()
  })

  t.test(
    'getConditions should omit keys/values when they are set to any',
    subtest => {
      let query = {
        state: 'any'
      }
      let conditions = getConditions(query, defaultConditions)
      subtest.equal(
        typeof conditions.state,
        'undefined',
        'State should be omitted'
      )
      subtest.equal(conditions.type, 'classic', 'Type should stay default')
      subtest.end()
    }
  )

  t.test('queryOptions should not get into conditions', subtest => {
    let query = {
      state: 'Draft',
      type: 'classic',
      sort: '-field',
      limit: '20'
    }
    let conditions = getConditions(query, defaultConditions)

    subtest.equal(
      typeof conditions.sort,
      'undefined',
      'Sort should not be in conditions'
    )
    subtest.equal(
      typeof conditions.limit,
      'undefined',
      'Limit should not be in conditions'
    )
    subtest.end()
  })

  t.test('getOptions should only return options and nothing else', subtest => {
    let query = {
      state: 'Draft',
      type: 'classic',
      sort: '-field',
      limit: '20'
    }
    let expectedOptions = {
      sort: '-field',
      limit: '20'
    }
    subtest.deepEqual(
      getOptions(query, defaultOptions),
      expectedOptions,
      'Returns only option fields from the query'
    )
    subtest.end()
  })

  t.test(
    'getOptions should reassign option from query but not omit defaults',
    subtest => {
      let query = {
        limit: 22
      }
      let expectedOptions = {
        limit: 22,
        sort: 'createdDate'
      }
      subtest.deepEqual(
        getOptions(query, defaultOptions),
        expectedOptions,
        'Rewrites limit but sort stays default'
      )
      subtest.end()
    }
  )
  t.end()
})
