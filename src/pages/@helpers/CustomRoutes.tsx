import { Redirect, Route } from 'react-router-dom'

import { useAuthContext } from 'hooks/web3/useAuth'
import Loading from 'theme/Loading'
import { Box } from 'theme/base'
import routes from 'utils/config/routes'

const AuthedRoute = ({ component: Component, componentProps, ...rest }: any) => {
  const { isAuthenticated } = useAuthContext()

  return (
    <Route
      {...rest}
      render={({ location, ...props }: any) => {
        if (isAuthenticated === null)
          return (
            <Box p={4}>
              <Loading />
            </Box>
          )
        return isAuthenticated ? (
          <Component location={location} {...componentProps} {...props} />
        ) : (
          <Redirect
            to={{
              pathname: routes.HOME.path,
              state: { from: location },
            }}
          />
        )
      }}
    />
  )
}

export default AuthedRoute

export const IsUserRedirect = ({ component: Component, ...rest }: any) => {
  const { isAuthenticated } = useAuthContext()
  return (
    <Route
      {...rest}
      render={({ location, ...props }: any) => {
        if (isAuthenticated === null)
          return (
            <Box p={4}>
              <Loading />
            </Box>
          )
        if (isAuthenticated) {
          return (
            <Redirect
              to={{
                pathname: routes.HOME.path,
                state: { from: location },
              }}
            />
          )
        }
        return <Component location={location} {...props} />
      }}
    />
  )
}

export const IsUserAuthed = ({ component: Component, ...rest }: any) => {
  const { isAuthenticated } = useAuthContext()
  return (
    <Route
      {...rest}
      render={({ location, ...props }: any) => {
        if (isAuthenticated === null)
          return (
            <Box p={4}>
              <Loading />
            </Box>
          )
        return <Component location={location} isAuthenticated={isAuthenticated} {...props} />
      }}
    />
  )
}
