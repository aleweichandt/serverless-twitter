import * as React from 'react'
import { Grid } from 'semantic-ui-react'
import Auth from '../../auth/Auth'
import { getAvatartUploadUrl, uploadFile, updateProfile } from '../../api/users-api'
import { User } from '../../types/User'
import { UploadState } from '../../types/UploadState'
import AvatarEdit from './AvatarEdit'
import UsernameEdit from './UsernameEdit'
import { UpdateUserRequest } from '../../types/UpdateUserRequest'

interface EditProfileProps {
  auth: Auth
  user: User
}

interface EditProfileState {
  file: any
  uploadState: UploadState
  username: string
  updateState: boolean
}

export class EditProfile extends React.PureComponent<
  EditProfileProps,
  EditProfileState
> {
  state: EditProfileState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    username: '',
    updateState: false
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: event.target.value })
  }

  handleUpdate = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    this.setState({ updateState: true })
    const request: UpdateUserRequest = {
      username: this.state.username
    }
    await updateProfile(this.props.auth.getIdToken(), request)
    this.setState({ updateState: false })
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleFileSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getAvatartUploadUrl(this.props.auth.getIdToken())

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <h1>Profile</h1>
        <Grid>
          <Grid.Row>
            <Grid.Column width={2}>
              <AvatarEdit 
                user={this.props.user}
                uploadState={this.state.uploadState}
                onSelectSource={this.handleFileChange}
                onSubmit={this.handleFileSubmit}
              />
            </Grid.Column>
            <Grid.Column width={14}>
              <UsernameEdit
                user={this.props.user}
                loading={this.state.updateState}
                onChange={this.handleNameChange}
                onSubmit={this.handleUpdate}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
