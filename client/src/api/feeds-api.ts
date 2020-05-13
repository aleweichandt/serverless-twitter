import { apiEndpoint } from '../config'
import { Feed } from '../types/Feed'
import { CreateFeedRequest } from '../types/CreateFeedRequest'
import Axios from 'axios'

export async function getFeeds(idToken: string): Promise<Feed[]> {
  console.log('Fetching feeds')

  const response = await Axios.get(`${apiEndpoint}/feeds`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Feeds:', response.data)
  return response.data.items
}

export async function createFeed(
  idToken: string,
  newFeed: CreateFeedRequest
): Promise<Feed> {
  const response = await Axios.post(
    `${apiEndpoint}/feeds`,
    JSON.stringify(newFeed),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.item
}

export async function deleteFeed(
  idToken: string,
  feedId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/feeds/${feedId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}
