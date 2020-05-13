import { ImageAccess } from '../dataLayer/ImageAccess'
import { User } from '../models/User'
import { UserAccess } from '../dataLayer/userAccess'
import { CreateUserRequet } from '../requests/CreateUserRequest'

const userAccess = new UserAccess()
const imageAccess = new ImageAccess()

export async function createUserWithId(
  userRequest: CreateUserRequet
): Promise<User> {
  const avatarUrl = await imageAccess.getAccessUrl(userRequest.userId)

  const user: User = {
    avatarUrl,
    ...userRequest
  }

  return userAccess.createUser(user)
}
