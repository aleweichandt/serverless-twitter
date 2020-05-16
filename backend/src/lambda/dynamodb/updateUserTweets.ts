import 'source-map-support/register'
import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { updateTweetsUserInfo } from '../../businessLogic/tweets'
import { UserUpdate } from '../../models/UserUpdate'

const logger = createLogger('updateTweets')

export const handler: DynamoDBStreamHandler = async (
  event: DynamoDBStreamEvent
) => {
  logger.info('Processing events batch from DynamoDB', JSON.stringify(event))

  for (const record of event.Records) {
    console.log('Processing record', JSON.stringify(record))
    if (record.eventName !== 'MODIFY') {
      continue
    }

    const newItem = record.dynamodb.NewImage
    const userId = newItem.userId.S
    const update: UserUpdate = {
      username: newItem.username.S
    }
    logger.info('Updating userId tweets with update', { userId, update })
    try {
      const tweets = await updateTweetsUserInfo(userId, update)
      logger.info('Updated userId tweets with update', {
        userId,
        update,
        tweets
      })
    } catch (error) {
      logger.error('Error updating userId tweets with update', {
        error,
        userId,
        update
      })
    }
  }
}
