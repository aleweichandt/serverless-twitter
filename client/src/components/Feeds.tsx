import { History } from 'history'
import * as React from 'react'
import {
  Divider,
  Grid,
  Header,
  Loader
} from 'semantic-ui-react'

import { createFeed, deleteFeed, getFeeds } from '../api/feeds-api'
import Auth from '../auth/Auth'
import { Feed } from '../types/Feed'
import FeedItem from './FeedItem'
import NewFeed from './NewFeed'

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
        {this.renderCreateFeed()}
        <Header as="h1">Latest Tweets</Header>
        {this.renderFeeds()}
      </div>
    )
  }

  renderCreateFeed() {
    return this.props.auth.isAuthenticated() ? (
      <NewFeed onChange={this.handleNameChange} onSubmit={this.onFeedCreate}/>
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
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
        {this.state.feeds.map((feed, pos) => (
          <FeedItem 
            item={feed} 
            key={feed.tweetId} 
            onDelete={this.onFeedDelete} 
            owned={false}/>
        ))}
      </Grid>
    )
  }
}
