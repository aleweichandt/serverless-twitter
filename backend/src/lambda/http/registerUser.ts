import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { createUserWithId } from '../../businessLogic/users'

const logger = createLogger('registerUser');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event', { event })
  const userId = getUserId(event)

  const user = await createUserWithId(userId)

  return {
    statusCode: 201,
    body: JSON.stringify({ user })
  }
})

handler.use(cors({ credentials: true }))
