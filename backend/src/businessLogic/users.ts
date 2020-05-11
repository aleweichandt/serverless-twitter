import * as uuid from 'uuid'
import { ImageAccess } from "../dataLayer/ImageAccess"
import { User } from "../models/User"
import { UserAccess } from '../dataLayer/userAccess'

const userAccess = new UserAccess()
const imageAccess = new ImageAccess()

export async function createUserWithId(userId: string): Promise<User> {
    const avatarUrl = await imageAccess.getAccessUrl(userId)

    const username = `guest-${uuid.v4()}`
    
    const user: User = {
        userId,
        avatarUrl,
        username
    }

    return userAccess.createUser(user)
}