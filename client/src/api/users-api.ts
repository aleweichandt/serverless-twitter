import Axios from 'axios'
import { apiEndpoint } from '../config'
import { UpdateUserRequest } from '../types/UpdateUserRequest'

export async function patchUser(
  idToken: string,
  userId: string,
  updatedUser: UpdateUserRequest
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/users/${userId}`,
    JSON.stringify(updatedUser),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function getUploadUrl(
  idToken: string,
  userId: string
): Promise<string> {
  const response = await Axios.post(
    `${apiEndpoint}/users/${userId}/attachment`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.uploadUrl
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file)
}
