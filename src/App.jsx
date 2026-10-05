import { useState } from 'react'
import Header from './components/Header'
import ChatWindow from './components/ChatWindow'
import InputBox from './components/InputBox'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  async function handleSend(text) {
      if (isLoading) return

  const userMessage = {
    text,
    sender: 'You',
  }

  const updatedMessages = [...messages, userMessage]

  setMessages(updatedMessages)
  setIsLoading(true)

  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: updatedMessages,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'API request failed')
    }

    const assistantMessage = {
      text: data.reply,
      sender: 'Nova',
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      assistantMessage,
    ])
  } catch (error) {
  console.error('Chat error:', error)

  setMessages((previousMessages) => [
    ...previousMessages,
    {
      text: `Sorry, I couldn't process that request. ${error.message}`,
      sender: 'Nova',
    },
  ])
} finally {
  setIsLoading(false)
}
}

  return (
    <div className="app">
      <Header />
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
      />
      <InputBox onSend={handleSend} isLoading={isLoading} />
    </div>
  )
}

export default App