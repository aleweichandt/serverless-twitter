import React from 'react'
import { Switch, Route } from 'react-router-dom'
import HomeRouter from './HomeRouter'
import CallbackRoute from './CallbackRoute'

const AppRouter = () => (
    <Switch>
      <CallbackRoute exact path="/" redirect="/home"/>
      <CallbackRoute exact path="/callback" redirect="/home" />
      <Route path="/home">
        <HomeRouter/>
      </Route>
    </Switch>
)

export default AppRouter