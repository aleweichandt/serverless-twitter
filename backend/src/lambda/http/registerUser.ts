import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { createUserWithId } from '../../businessLogic/users'
import { getUserId, handleError } from '../utils'

const logger = createLogger('registerUser')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event', { event })
    const userId = getUserId(event)

    try {
      const user = await createUserWithId(userId)
      return {
        statusCode: 201,
        body: JSON.stringify({ user })
      }
    } catch (error) {
      return handleError(error)
    }
  }
)

handler.use(cors({ credentials: true }))
