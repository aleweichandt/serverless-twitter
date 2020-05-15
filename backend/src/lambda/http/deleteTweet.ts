import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { deleteUserTweet } from '../../businessLogic/tweets'
import { getUserId, handleError } from '../utils'

const logger = createLogger('deleteTweet')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event', { event })
    const tweetId = event.pathParameters.tweetId
    const userId = getUserId(event)

    try {
      const tweet = await deleteUserTweet(userId, tweetId)
      return {
        statusCode: 200,
        body: JSON.stringify({ tweet })
      }
    } catch (error) {
      return handleError(error)
    }
  }
).use(cors({ credentials: true }))
