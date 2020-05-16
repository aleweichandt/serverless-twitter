import React from 'react'
import {
  Input,
  Grid,
} from 'semantic-ui-react'

interface NewFeedProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onSubmit: (event: React.ChangeEvent<HTMLButtonElement>) => void
}

const NewFeed = ({ onChange, onSubmit}: NewFeedProps) => (
    <Grid.Row>
      <Grid.Column width={16}>
        <Input
          action={{
            color: 'teal',
            icon: 'add',
            onClick: onSubmit
          }}
          fluid
          actionPosition="left"
          placeholder="What are your thoughts..."
          onChange={onChange}
        />
      </Grid.Column>
    </Grid.Row>
)

export default NewFeed