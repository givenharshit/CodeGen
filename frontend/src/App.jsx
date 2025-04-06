import React from 'react'
import AppRouters from './Routers/AppRouters.jsx'
import { UserProvider } from './context/user.context.jsx'

const App = () => {
  return (
    // Wrap the AppRouters component with the UserProvider
    // to provide the user context to the entire application
    <UserProvider>
      <AppRouters />
    </UserProvider>
  )
}

export default App