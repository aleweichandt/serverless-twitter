import { createDBClient, DBClient } from '../utils/dbClient'
import { createLogger } from '../utils/logger'
import { User } from '../models/User'
import { UserUpdate } from '../models/UserUpdate'

const logger = createLogger('UserAccess')

export class UserAccess {
  constructor(
    private readonly dbClient: DBClient = createDBClient(),
    private readonly usersTable = process.env.USERS_TABLE
  ) {}

  async createUser(user: User): Promise<User> {
    logger.info('Adding user with info', { user })

    await this.dbClient
      .put({
        TableName: this.usersTable,
        Item: user
      })
      .promise()

    logger.info('Sucesfully added user', { user })

    return user
  }

  async updateUser(user: User, update: UserUpdate): Promise<User> {
    logger.info('Updating user with info', { user, update })

    const { userId } = user
    const result = await this.dbClient
      .update({
        TableName: this.usersTable,
        Key: { userId },
        UpdateExpression: 'set username=:username',
        ExpressionAttributeValues: {
          ':username': update.username
        },
        ReturnValues: 'ALL_NEW'
      })
      .promise()

    const updatedUser = result.Attributes
    logger.info('User updated', { user: updatedUser })

    return updatedUser as User
  }

  async getUser(userId: string): Promise<User> {
    logger.info('Looking for user with id', { userId })
    const result = await this.dbClient
      .get({
        TableName: this.usersTable,
        Key: { userId }
      })
      .promise()

    const user = result.Item

    logger.info('Sucesfully get user', { user })

    return user as User
  }
}
