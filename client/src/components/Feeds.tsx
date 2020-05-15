import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createFeed, deleteFeed, getFeeds } from '../api/feeds-api'
import Auth from '../auth/Auth'
import { Feed } from '../types/Feed'

interface FeedsProps {
  auth: Auth
  history: History
}

interface FeedsState {
  feeds: Feed[]
  newFeed: string
  loading: boolean
}

export class Feeds extends React.PureComponent<FeedsProps, FeedsState> {
  state: FeedsState = {
    feeds: [],
    newFeed: '',
    loading: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newFeed: event.target.value })
  }

  onFeedCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newFeed = await createFeed(this.props.auth.getIdToken(), {
        text: this.state.newFeed,
      })
      this.setState({
        feeds: [...this.state.feeds, newFeed],
        newFeed: ''
      })
    } catch {
      alert('Feed creation failed')
    }
  }

  onFeedDelete = async (feedId: string) => {
    try {
      await deleteFeed(this.props.auth.getIdToken(), feedId)
      this.setState({
        feeds: this.state.feeds.filter(feed => feed.tweetId != feedId)
      })
    } catch {
      alert('Feed deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const feeds = await getFeeds(this.props.auth.getIdToken())
      this.setState({
        feeds,
        loading: false
      })
    } catch (e) {
      alert(`Failed to fetch feeds: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Feeds</Header>

        {this.renderCreateFeed()}

        {this.renderFeeds()}
      </div>
    )
  }

  renderCreateFeed() {
    return this.props.auth.isAuthenticated ? (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Create',
              onClick: this.onFeedCreate
            }}
            fluid
            actionPosition="left"
            placeholder="What are your thoughts..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    ) : null
  }

  renderFeeds() {
    if (this.state.loading) {
      return this.renderLoading()
    }

    return this.renderFeedList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Feed
        </Loader>
      </Grid.Row>
    )
  }

  renderFeedList() {
    return (
      <Grid padded>
        {this.state.feeds.map((feed, pos) => {
          return (
            <Grid.Row key={feed.tweetId}>
              <Grid.Column width={2} verticalAlign="middle">
                <Image src={feed.avatarUrl} size="small" wrapped />
                {feed.username}
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {feed.text}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {feed.createdAt}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onFeedDelete(feed.tweetId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
