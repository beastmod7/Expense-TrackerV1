import React, { useState } from 'react'
    import WelcomeScreen from './WelcomeScreen'
    import ExpenseTrackerScreen from './ExpenseTrackerScreen'

    function App() {
      const [username, setUsername] = useState('')

      return (
        <div className="app">
          {!username ? (
            <WelcomeScreen onUsernameSubmit={setUsername} />
          ) : (
            <ExpenseTrackerScreen username={username} />
          )}
        </div>
      )
    }

    export default App
