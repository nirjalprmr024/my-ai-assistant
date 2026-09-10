import Message from './Message'

function ChatWindow({ messages }) {
  return (
    <main>
      {messages.map((message, index) => (
        <Message
          key={index}
          text={message.text}
          sender={message.sender}
        />
      ))}
    </main>
  )
}

export default ChatWindow