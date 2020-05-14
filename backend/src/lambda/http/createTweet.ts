import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { createUserTweet } from '../../businessLogic/tweets'
import { getUserId, handleError } from '../utils'
import { CreateTweetRequest } from '../../requests/CreateTweetRequest'

const logger = createLogger('createTweet')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event', { event })
    const userId = getUserId(event)
    const request: CreateTweetRequest = JSON.parse(event.body)

    try {
      const tweet = await createUserTweet(userId, request)
      return {
        statusCode: 201,
        body: JSON.stringify({ tweet })
      }
    } catch (error) {
      return handleError(error)
    }
  }
)

handler.use(cors({ credentials: true }))
