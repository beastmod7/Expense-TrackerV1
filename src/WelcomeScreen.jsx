import React, { useState, useEffect } from 'react'

export default function WelcomeScreen({ onUsernameSubmit }) {
  const [inputValue, setInputValue] = useState('')

  // Check for existing username on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('username')
    if (savedUsername) {
      onUsernameSubmit(savedUsername)
    }
  }, [onUsernameSubmit])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      localStorage.setItem('username', inputValue)
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
