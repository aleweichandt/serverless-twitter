import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { handleError } from '../utils'
import { getTweets } from '../../businessLogic/tweets'

const logger = createLogger('getTweets')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event', { event })

    try {
      const items = await getTweets()
      return {
        statusCode: 200,
        body: JSON.stringify({ items })
      }
    } catch (error) {
      return handleError(error)
    }
  }
).use(cors({ credentials: true }))
