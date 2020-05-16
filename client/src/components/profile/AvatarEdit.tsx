import React from 'react'
import { User } from '../../types/User'
import { Form, Image, Button, Input } from 'semantic-ui-react'
import { UploadState } from '../../types/UploadState'

interface AvatarEditProps {
    user: User
    uploadState: UploadState
    onSelectSource: (event: React.ChangeEvent<HTMLInputElement>) => void
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

const AvatarEdit = ({ user, uploadState, onSelectSource, onSubmit}: AvatarEditProps) => (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <Image src={user.avatarUrl} size="small" />
        <Input
          type="file"
          accept="image/*"
          placeholder="Image to upload"
          onChange={onSelectSource}
        />
      </Form.Field>
      {uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
      {uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
      <Button
        loading={uploadState !== UploadState.NoUpload}
        type="submit"
      >
        Upload
      </Button>
    </Form>
)

export default AvatarEdit