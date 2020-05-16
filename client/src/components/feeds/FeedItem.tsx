import React from 'react'
import {
  Button,
  Grid,
  Icon,
  Divider,
  Image
} from 'semantic-ui-react'
import { Feed } from '../../types/Feed';

interface FeedItemProps {
    item: Feed,
    owned: boolean,
    onDelete: (id: string) => void
}

const FeedItem = ({ item, owned, onDelete }: FeedItemProps) => (
    <Grid.Row>
      <Grid.Column width={1} verticalAlign="top">
        <Image src={item.avatarUrl} size="mini" wrapped circular bordered/>
      </Grid.Column>
      <Grid.Column width={15} verticalAlign="top">
        <Grid padded>
          <Grid.Row >
              <Grid.Column width={12} floated="left">
                    {item.username}
              </Grid.Column>
              <Grid.Column width={owned ? 3 : 4} floated="right">
                    {item.createdAt}
              </Grid.Column>
              {owned ? (
                <Grid.Column width={1} floated="right">
                    <Button
                        icon
                        color="red"
                        onClick={() => onDelete(item.tweetId)}>
                        <Icon name="delete" />
                    </Button>
                </Grid.Column>
              ) : null}
            <Grid.Column width={16}>
                <Divider />
            </Grid.Column>
              <Grid.Column width={14} floated="left">
                {item.text}
              </Grid.Column>
          </Grid.Row>
          </Grid>
      </Grid.Column>
      <Grid.Column width={16}>
        <Divider />
      </Grid.Column>
    </Grid.Row>
)

export default FeedItem