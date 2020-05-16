import * as uuid from 'uuid'
import { CreateTweetRequest } from '../requests/CreateTweetRequest'
import { getUserWithId } from './users'
import { Tweet } from '../models/Tweet'
import {
  InvalidRequestError,
  NotFoundError,
  ForbiddenError
} from '../models/Error'
import { TweetAccess } from '../dataLayer/tweetAccess'
import { createLogger } from '../utils/logger'
import { UserUpdate } from '../models/UserUpdate'
import { topicsFor, globalTopic } from './topics'

const logger = createLogger('tweetsLogic')

const tweetAccess = new TweetAccess()

export async function createUserTweet(
  userId: string,
  request: CreateTweetRequest
): Promise<Tweet> {
  const user = await getUserWithId(userId)
  if (!user) {
    throw new InvalidRequestError('Invalid user for request')
  }
  const createdAt = new Date().toISOString()

  const topics = await topicsFor(request.text)

  const results = await Promise.all(
    topics.map((topic: string) => {
      const tweet: Tweet = {
        tweetId: `${userId}-${topic}-${createdAt}`,
        createdAt,
        topic,
        ...user,
        text: request.text
      }
      return tweetAccess.createTweet(tweet)
    })
  )
  return results[0]
}

export async function getTweetsForTopic(
  topic: string = globalTopic
): Promise<Tweet[]> {
  return tweetAccess.getLatestTweetsForTopic(topic)
}

export async function deleteUserTweet(
  userId: string,
  tweetId: string
): Promise<Tweet> {
  const tweet = await findUserOwnedTweet(userId, tweetId)

  return tweetAccess.deleteTweet(tweet)
}

export async function updateTweetsUserInfo(
  userId: string,
  update: UserUpdate
): Promise<Tweet[]> {
  const tweets = await tweetAccess.getUserTweets(userId)
  const updates = tweets.map((tweet: Tweet) =>
    tweetAccess.updateTweet(tweet, update)
  )
  return Promise.all(updates)
}

async function findUserOwnedTweet(
  userId: string,
  tweetId: string
): Promise<Tweet> {
  let item: Tweet = null
  try {
    item = await tweetAccess.getUserTweet(userId, tweetId)
  } catch (error) {
    logger.error('tweet not found', { tweetId })
    throw new NotFoundError('not found')
  }
  if (item && item.userId !== userId) {
    logger.error('tweet with id does not belong to user', {
      tweet: item,
      userId
    })
    throw new ForbiddenError('tweet does not belong to this user')
  }
  return item
}
