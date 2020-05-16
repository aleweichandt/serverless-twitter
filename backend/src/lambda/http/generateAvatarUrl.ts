import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId, handleError } from '../utils'
import { getUserAvatartUrl } from '../../businessLogic/users'

const logger = createLogger('generateAvatarUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event', { event })
    const userIdParam = event.pathParameters.userId
    const userId = userIdParam === 'me' ? getUserId(event) : userIdParam

    try {
      const uploadUrl = await getUserAvatartUrl(userId)
      return {
        statusCode: 200,
        body: JSON.stringify({ uploadUrl })
      }
    } catch (error) {
      handleError(error)
    }
  }
).use(cors({ credentials: true }))
