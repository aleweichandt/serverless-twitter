import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'

interface Props extends RouteProps {
    redirect: string
}

const CallbackRoute = ({redirect, ...props}: Props) => (
    <Route {...props} render={({ location }) =>
        <Redirect
        to={{
            pathname: redirect,
            state: { from: location }
        }}
        />
    } />
)

export default CallbackRoute