import * as uuid from 'uuid'
import { ImageAccess } from '../dataLayer/ImageAccess'
import { User } from '../models/User'
import { UserAccess } from '../dataLayer/userAccess'
import { InvalidRequestError, NotFoundError } from '../models/Error'
import { UpdateUserRequest } from '../requests/UpdateUserRequest'

const userAccess = new UserAccess()
const imageAccess = new ImageAccess()

export async function createUserWithId(userId: string): Promise<User> {
  try {
    await getUserWithId(userId)
    throw new InvalidRequestError('Invalid Request')
  } catch (error) {}
  const username = `guest-${uuid.v4()}`
  const avatarUrl = await imageAccess.getAccessUrl(userId)

  const user: User = {
    userId,
    username,
    avatarUrl
  }

  return userAccess.createUser(user)
}

export async function updateUserWithId(
  userId: string,
  request: UpdateUserRequest
): Promise<User> {
  const user = await userAccess.getUser(userId)

  return userAccess.updateUser(user, request)
}

export async function getUserWithId(userId: string): Promise<User> {
  try {
    return userAccess.getUser(userId)
  } catch (error) {
    throw new NotFoundError('User does not exist')
  }
}

export async function getUserAvatartUrl(userId: string): Promise<string> {
  return imageAccess.getUploadUrl(userId)
}
