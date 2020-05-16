import * as uuid from 'uuid'
import { ImageAccess } from '../dataLayer/ImageAccess'
import { User } from '../models/User'
import { UserAccess } from '../dataLayer/userAccess'
import { InvalidRequestError } from '../models/Error'

const userAccess = new UserAccess()
const imageAccess = new ImageAccess()

export async function createUserWithId(userId: string): Promise<User> {
  const matchingUser = await getUserWithId(userId)
  if (!!matchingUser) {
    throw new InvalidRequestError('Invalid Request')
  }
  const username = `guest-${uuid.v4()}`
  const avatarUrl = await imageAccess.getAccessUrl(userId)

  const user: User = {
    userId,
    username,
    avatarUrl
  }

  return userAccess.createUser(user)
}

export async function getUserWithId(userId: string): Promise<User> {
  const user = userAccess.getUser(userId)

  return user
}

export async function getUserAvatartUrl(userId: string): Promise<string> {
  return imageAccess.getUploadUrl(userId)
}
