import { createDBClient, DBClient } from '../utils/dbClient'
import { createLogger } from '../utils/logger'
import { Tweet } from '../models/Tweet'

const logger = createLogger('TweetAccess')

export class TweetAccess {
  constructor(
    private readonly dbClient: DBClient = createDBClient(),
    private readonly tweetsTable = process.env.TWEETS_TABLE
  ) {}

  async createTweet(tweet: Tweet): Promise<Tweet> {
    logger.info('Adding tweet with info', { tweet })

    await this.dbClient
      .put({
        TableName: this.tweetsTable,
        Item: tweet
      })
      .promise()

    logger.info('Sucesfully added tweet', { tweet })

    return tweet
  }

  async getLatestTweetsFrom(): Promise<Tweet[]> {
    logger.info('Fetching latest tweets')

    try {
      const result = await this.dbClient
        .scan({
          TableName: this.tweetsTable
        })
        .promise()

      const items = result.Items
      logger.info('Sucesfully fetch tweets', { items })

      return items as Tweet[]
    } catch (error) {
      logger.error('error:', { error })
      throw error
    }
  }
}
