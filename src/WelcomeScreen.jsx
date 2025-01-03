import React, { useState } from 'react'

    export default function WelcomeScreen({ onUsernameSubmit }) {
      const [inputValue, setInputValue] = useState('')

      const handleSubmit = (e) => {
        e.preventDefault()
        if (inputValue.trim()) {
          onUsernameSubmit(inputValue)
        }
      }

      return (
        <div className="welcome-screen">
          <h1>Welcome to Expense Tracker</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter your username"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
            />
            <button type="submit">Continue</button>
          </form>
        </div>
      )
    }
