import { createDBClient, DBClient } from '../utils/dbClient'
import { createLogger } from '../utils/logger'
import { Tweet } from '../models/Tweet'

const logger = createLogger('TweetAccess')

export class TweetAccess {
  constructor(
    private readonly dbClient: DBClient = createDBClient(),
    private readonly usersTable = process.env.TWEETS_TABLE
  ) {}

  async createTweet(tweet: Tweet): Promise<Tweet> {
    logger.info('Adding tweet with info', { tweet })

    await this.dbClient
      .put({
        TableName: this.usersTable,
        Item: tweet
      })
      .promise()

    logger.info('Sucesfully added tweet', { tweet })

    return tweet
  }
}
