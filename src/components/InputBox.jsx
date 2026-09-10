import { useState } from 'react'

function InputBox({ onSend }) {
  const [text, setText] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (!text.trim()) return

    onSend(text)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      <button type="submit">Send</button>
    </form>
  )
}

export default InputBox