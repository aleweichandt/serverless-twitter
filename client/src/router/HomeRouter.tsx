import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import Feed from '../views/Feed'
import Profile from '../views/Profile'
import NotFound from '../views/NotFound'

const HomeRouter = () => {
  const { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <PrivateRoute path={`${path}/profile`} condition={true} redirect={path}>
          <Profile/>
        </PrivateRoute>
        <Route exact path={path}>
          <Feed/>
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </div>
  )
}

export default HomeRouter