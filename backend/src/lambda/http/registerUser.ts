import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { createUserWithId } from '../../businessLogic/users'
import { CreateUserRequet } from '../../requests/CreateUserRequest'

const logger = createLogger('registerUser')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event', { event })
    const request: CreateUserRequet = JSON.parse(event.body)

    const user = await createUserWithId(request)

    return {
      statusCode: 201,
      body: JSON.stringify({ user })
    }
  }
)

handler.use(cors({ credentials: true }))
