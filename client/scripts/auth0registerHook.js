/**
@param {object} user - The user being created
@param {string} user.id - user id
@param {string} user.tenant - Auth0 tenant name
@param {string} user.username - user name
@param {string} user.email - email
@param {boolean} user.emailVerified - is e-mail verified?
@param {string} user.phoneNumber - phone number
@param {boolean} user.phoneNumberVerified - is phone number verified?
@param {object} user.user_metadata - user metadata
@param {object} user.app_metadata - application metadata
@param {object} context - Auth0 connection and other context info
@param {string} context.requestLanguage - language of the client agent
@param {object} context.connection - information about the Auth0 connection
@param {object} context.connection.id - connection id
@param {object} context.connection.name - connection name
@param {object} context.connection.tenant - connection tenant
@param {object} context.webtask - webtask context
@param {function} cb - function (error, response)
*/
const request = require('request@2.88.2')

const apiId = 'i5s5x6z3z5'
const apiEndpoint =
  'https://' + apiId + '.execute-api.us-east-1.amazonaws.com/dev'

module.exports = function (user, context, cb) {
  const method = 'POST'
  const url = apiEndpoint + '/users/register'
  const headers = {
    'Content-Type': 'application/json'
  }
  const body = {
    userId: user.id,
    username: user.username
  }

  request(
    {
      method: method,
      url: url,
      headers: headers,
      body: JSON.stringify(body)
    },
    function (error, response) {
      console.log('error', error)
      console.log('response', response)
      cb(error, response)
    }
  )
}
