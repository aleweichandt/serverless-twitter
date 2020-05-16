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
  const tweetId = uuid.v4()
  const createdAt = new Date().toISOString()
  const tweet: Tweet = {
    tweetId,
    createdAt,
    ...user,
    text: request.text
  }
  return tweetAccess.createTweet(tweet)
}

export async function getTweets(): Promise<Tweet[]> {
  return tweetAccess.getLatestTweets()
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
