import * as uuid from 'uuid'
import { CreateTweetRequest } from '../requests/CreateTweetRequest'
import { getUserWithId } from './users'
import { Tweet } from '../models/Tweet'
import { InvalidRequestError } from '../models/Error'
import { TweetAccess } from '../dataLayer/tweetAccess'

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
