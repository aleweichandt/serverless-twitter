import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { getUserId, handleError } from '../utils'
import { UpdateUserRequest } from '../../requests/UpdateUserRequest'
import { updateUserWithId } from '../../businessLogic/users'

const logger = createLogger('updateUser')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event', { event })
    const userIdParam = event.pathParameters.userId
    const userId = userIdParam === 'me' ? getUserId(event) : userIdParam
    const request: UpdateUserRequest = JSON.parse(event.body)

    try {
      const tweet = await updateUserWithId(userId, request)
      return {
        statusCode: 200,
        body: JSON.stringify({ tweet })
      }
    } catch (error) {
      return handleError(error)
    }
  }
).use(cors({ credentials: true }))
