import React, { Component } from 'react'
import { Link, Route, Router, Switch, Redirect } from 'react-router-dom'
import { Grid, Menu, Segment } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditProfile } from './components/EditProfile'
import { NotFound } from './components/NotFound'
import { Feeds } from './components/Feeds'
import { User } from './types/User'
import { getProfile, registerUser } from './api/users-api'

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {
  user: User | void
}

export default class App extends Component<AppProps, AppState> {
  state: AppState = {
    user: undefined
  }
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  componentDidMount() {
    this.props.auth.registerAuthCallback(this.fetchProfileInfo)
  }

  componentWillUnmount() {
    this.props.auth.unregisterAuthCallback()
  }

  fetchProfileInfo = async (idToken: string) => {
    try {
      await registerUser(idToken)
    } catch(err) {}
    const user = await getProfile(this.props.auth.idToken)
    this.setState({ user })
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu>
        <Menu.Item name="home">
          <Link to="/">Home</Link>
        </Menu.Item>

        <Menu.Menu position="right">{this.logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <>
          <Menu.Item name="profile" >
            <Link to="/profile/me">Profile</Link>
          </Menu.Item>
          <Menu.Item name="logout" onClick={this.handleLogout}>
            Log Out
          </Menu.Item>
        </>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Feeds {...props} auth={this.props.auth} user={this.state.user}/>
          }}
        />

        <Route
          path="/profile/me"
          exact
          render={props => {
            return this.state.user ? (
              <EditProfile {...props} auth={this.props.auth} user={this.state.user}/>
            ) : (
              <Redirect to={{pathname: "/"}}/>
            )
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
