import test from 'tape'
import User from './user-model'

test('Strong password method', t => {
  const weakPasswords = [
    'test',
    'human',
    '12345',
    '0000',
    ' ',
    'pokemon123'
  ]

  const strongPasswords = [
    'ThisShouldBeEnough12',
    'ThisAsWell3',
    'Andthisisok12',
    '123CanStartWithNumber'
  ]

  weakPasswords.forEach(pwd => {
    t.notOk(
      User.isStrongPassword(pwd),
      `${pwd} should not be allowed as a password`
    )
  })

  strongPasswords.forEach(pwd => {
    t.ok(
      User.isStrongPassword(pwd),
      `${pwd} should be allowed as a password`
    )
  })
})
