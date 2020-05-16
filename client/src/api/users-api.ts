import Axios from 'axios'
import { apiEndpoint } from '../config'
import { User } from '../types/User'
import { UpdateUserRequest } from '../types/UpdateUserRequest'

export async function registerUser(idToken: string): Promise<User> {
  const response = await Axios.post(
    `${apiEndpoint}/users/register`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.user
}

export async function getProfile(idToken: string): Promise<User> {
  const response = await Axios.get(`${apiEndpoint}/users/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  return response.data.user
}

export async function updateProfile(
  idToken: string,
  updatedUser: UpdateUserRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/users/me`, JSON.stringify(updatedUser), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}

export async function getAvatartUploadUrl(idToken: string): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/users/me/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file)
}
