import { Redirect, Route, RouteComponentProps } from 'react-router-dom'

import { useAuthContext } from 'hooks/web3/useAuth'
import Loading from 'theme/Loading'
import { Box } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { PROTOCOLS } from 'utils/config/protocols'
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

export const ProtocolRoute = ({ component: Component, componentProps, ...rest }: any) => {
  return (
    <Route
      {...rest}
      render={({ location, ...props }: any) => {
        return PROTOCOLS.includes(location.pathname.split('/')[1]) ? (
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

export const ProtocolRedirectRoute = (props: any) => (
  <Route
    {...props}
    render={(props: RouteComponentProps) => (
      <Redirect to={{ ...props.location, pathname: `/${ProtocolEnum.GMX}${props.location.pathname}` }} />
    )}
  />
)

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
