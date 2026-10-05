import ReactMarkdown from 'react-markdown'

function Message({ text, sender }) {
  const isUser = sender === 'You'

  return (
    <div className={`message-row ${isUser ? 'user-row' : 'assistant-row'}`}>
      <div className={`message ${isUser ? 'user-message' : 'assistant-message'}`}>
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
  )
}

export default Message