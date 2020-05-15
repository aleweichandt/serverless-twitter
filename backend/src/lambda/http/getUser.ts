import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { handleError, getUserId } from '../utils'
import { getUserWithId } from '../../businessLogic/users'

const logger = createLogger('getUser')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event', { event })
    try {
      const userIdParam = event.pathParameters.userId
      const userId = userIdParam === 'me' ? getUserId(event) : userIdParam

      const user = await getUserWithId(userId)
      return {
        statusCode: 200,
        body: JSON.stringify({ user })
      }
    } catch (error) {
      return handleError(error)
    }
  }
).use(cors({ credentials: true }))
