import { useState } from 'react'

function InputBox({ onSend, isLoading }) {
  const [text, setText] = useState('')

  function handleSubmit(event) {
  event.preventDefault()

  if (!text.trim() || isLoading) return

  onSend(text)
  setText('')
}

  return (
    <form className="input-area" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Message Nova..."
        value={text}
        onChange={(event) => setText(event.target.value)}
        disabled={isLoading}
      />

      <button type="submit" disabled={isLoading}>{isLoading ? 'Thinking...' : 'Send'}</button>
    </form>
  )
}

export default InputBox