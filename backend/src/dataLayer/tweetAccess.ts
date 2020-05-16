import { createDBClient, DBClient } from '../utils/dbClient'
import { createLogger } from '../utils/logger'
import { Tweet } from '../models/Tweet'
import { TweetUpdate } from '../models/TweetUpdate'

const logger = createLogger('TweetAccess')

export class TweetAccess {
  constructor(
    private readonly dbClient: DBClient = createDBClient(),
    private readonly tweetsTable = process.env.TWEETS_TABLE,
    private readonly userIndex = process.env.USER_INDEX
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

  async updateTweet(tweet: Tweet, update: TweetUpdate): Promise<Tweet> {
    logger.info('Updating tweet with info', { tweet, update })

    const { tweetId, createdAt } = tweet
    const result = await this.dbClient
      .update({
        TableName: this.tweetsTable,
        Key: { tweetId, createdAt },
        UpdateExpression: 'set username=:username',
        ExpressionAttributeValues: {
          ':username': update.username
        },
        ReturnValues: 'ALL_NEW'
      })
      .promise()

    const updatedTweet = result.Attributes
    logger.info('Tweet updated', { tweet: updatedTweet })

    return updatedTweet as Tweet
  }

  async deleteTweet(tweet: Tweet): Promise<Tweet> {
    const { createdAt, tweetId } = tweet
    logger.info('Delete tweet with id', { tweetId })

    const result = await this.dbClient
      .delete({
        TableName: this.tweetsTable,
        Key: { tweetId, createdAt },
        ReturnValues: 'ALL_OLD'
      })
      .promise()

    const deletedItem = result.Attributes
    logger.info('Tweet deleted', { tweet: deletedItem })

    return deletedItem as Tweet
  }

  async getLatestTweetsFrom(): Promise<Tweet[]> {
    logger.info('Fetching latest tweets')

    const result = await this.dbClient
      .scan({
        TableName: this.tweetsTable
      })
      .promise()

    const items = result.Items
    logger.info('Sucesfully fetch tweets', { items })

    return items as Tweet[]
  }

  async getUserTweets(userId: string): Promise<Tweet[]> {
    logger.info('Fetching all tweets for user', { userId })

    const result = await this.dbClient
      .query({
        TableName: this.tweetsTable,
        IndexName: this.userIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    if (result.Items.length < 1) {
      logger.error('Tweet not found', { userId })
      throw new Error('not found')
    }

    const tweets = result.Items
    logger.info('Tweet for user', { userId, tweets })

    return tweets as Tweet[]
  }

  async getUserTweet(userId: string, tweetId: string): Promise<Tweet> {
    logger.info('Fetching tweet with id for user', { tweetId, userId })

    const result = await this.dbClient
      .query({
        TableName: this.tweetsTable,
        IndexName: this.userIndex,
        KeyConditionExpression: 'tweetId = :tweetId and userId = :userId',
        ExpressionAttributeValues: {
          ':tweetId': tweetId,
          ':userId': userId
        }
      })
      .promise()

    if (result.Items.length < 1) {
      logger.error('Tweet not found', { tweetId, userId })
      throw new Error('not found')
    }

    const tweet = result.Items[0]
    logger.info('Tweet for user', { userId, tweet })

    return tweet as Tweet
  }
}
