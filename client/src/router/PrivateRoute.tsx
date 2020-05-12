import React from 'react'
import { Route, RouteProps, Redirect } from 'react-router-dom'

interface Props extends RouteProps {
    condition: boolean
    redirect: string
}

const PrivateRoute = ({ condition, redirect, children, ...rest }: Props) => (
    <Route
      {...rest}
      render={({ location }) => condition ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: redirect,
              state: { from: location }
            }}
          />
        )
      }
    />
)

export default PrivateRoute