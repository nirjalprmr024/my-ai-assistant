import { useEffect, useRef } from 'react'
import Message from './Message'

function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages])

  if (messages.length === 0) {
    return (
      <main className="chat-window empty-chat">
        <div className="welcome">
          <div className="welcome-avatar">N</div>

          <h2>Hey, I'm Nova 👋</h2>

          <p>
            Your personal AI assistant.
            <br />
            Ask me anything to get started.
          </p>
        </div>
      </main>
    )
  }

  return (
  <main className="chat-window">
    {messages.map((message, index) => (
      <Message
        key={index}
        text={message.text}
        sender={message.sender}
      />
    ))}

    {isLoading && (
      <div className="message-row assistant-row">
        <div className="message assistant-message typing-indicator">
          Nova is thinking...
        </div>
      </div>
    )}

    <div ref={bottomRef}></div>
  </main>
)

  return (
    <main className="chat-window">
      {messages.map((message, index) => (
        <Message
          key={index}
          text={message.text}
          sender={message.sender}
        />
      ))}

      <div ref={bottomRef}></div>
    </main>
  )
}

export default ChatWindow