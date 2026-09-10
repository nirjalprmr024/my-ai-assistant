import { useState } from 'react'
import Header from './components/Header'
import ChatWindow from './components/ChatWindow'
import InputBox from './components/InputBox'

function App() {
  const [messages, setMessages] = useState([])

  function handleSend(text) {
    const userMessage = {
    text: text,
    sender: 'You',
  }

  const assistantMessage = {
    text: 'Hey! I am Nova. I received your message.',
    sender: 'Nova',
  }

  setMessages([...messages, userMessage, assistantMessage])
}
  return (
    <div>
      <Header />
      <ChatWindow messages={messages} />
      <InputBox onSend={handleSend} />
    </div>
  )
}

export default App