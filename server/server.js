import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenAI } from '@google/genai'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '../.env' })

const app = express()

app.use(cors())
app.use(express.json())

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

const memoryFile = path.join(process.cwd(), 'memory', 'memory.json')

function loadMemory() {
  const data = fs.readFileSync(memoryFile, 'utf-8')
  return JSON.parse(data)
}

function saveMemory(memory) {
  fs.writeFileSync(
    memoryFile,
    JSON.stringify(memory, null, 2),
  )
}

function saveFact(memory, key, value) {
  const existingFact = memory.facts.find(
    (fact) => fact.key === key,
  )

  if (existingFact) {
    existingFact.value = value
  } else {
    memory.facts.push({
      key,
      value,
    })
  }

  saveMemory(memory)

  console.log(`Memory saved: ${key} = ${value}`)
}

function deleteFact(memory, key) {
  const originalLength = memory.facts.length

  memory.facts = memory.facts.filter(
    (fact) => fact.key !== key,
  )

  if (memory.facts.length < originalLength) {
    saveMemory(memory)
    console.log(`Memory deleted: ${key}`)
    return true
  }

  return false
}

function extractMemory(text, memory) {
  const patterns = [
    {
      key: 'name',
      pattern: /my name is\s+([a-zA-Z]+)/i,
    },
    {
      key: 'city',
      pattern: /i live in\s+([a-zA-Z\s]+)/i,
    },
    {
      key: 'interest',
      pattern: /i like\s+([a-zA-Z\s]+)/i,
    },
  ]

  for (const item of patterns) {
    const match = text.match(item.pattern)

    if (!match) continue

    const value = match[1].trim()

    saveFact(memory, item.key, value)
  }

  return memory
}

function buildMemoryContext(memory) {
  if (memory.facts.length === 0) {
    return 'No saved memories yet.'
  }

  return memory.facts
    .map((fact) => `${fact.key}: ${fact.value}`)
    .join('\n')
}

function formatMemoryForUser(memory) {
  if (memory.facts.length === 0) {
    return "I don't have any saved memories about you yet."
  }

  return memory.facts
    .map((fact) => `${fact.key}: ${fact.value}`)
    .join('\n')
}

function getRecentMessages(messages, limit = 10) {
  return messages.slice(-limit)
}

function buildConversation(messages) {
  return messages.map((message) => ({
    role: message.sender === 'You' ? 'user' : 'model',
    parts: [
      {
        text: message.text,
      },
    ],
  }))
}

app.post('/api/chat', async (req, res) => {
  try {

    const memory = loadMemory()

    const { messages } = req.body

    const latestMessage = messages[messages.length - 1]

    if (
      latestMessage?.sender === 'You' &&
      /forget.*live in\s+([a-zA-Z\s]+)/i.test(latestMessage.text)
    ) {
      const match = latestMessage.text.match(
        /forget.*live in\s+([a-zA-Z\s]+)/i,
      )

      const deleted = deleteFact(memory, 'city')

      return res.json({
        reply: deleted
          ? `Got it! I've forgotten that you live in ${match[1].trim()}.`
          : "I don't have your city saved.",
      })
    }

    if (
      latestMessage?.sender === 'You' &&
      /what do you remember about me|what do you know about me/i.test(
        latestMessage.text,
      )
    ) {
      return res.json({
        reply: formatMemoryForUser(memory),
      })
    }

    if (latestMessage?.sender === 'You') {
      extractMemory(latestMessage.text, memory)
    }

    const recentMessages = getRecentMessages(messages)
    const conversation = buildConversation(recentMessages)

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: conversation,
      config: {
        systemInstruction: `
        You are Nova, a friendly personal AI assistant.

        Saved user memories:
        ${buildMemoryContext(memory)}

        Use these memories when relevant.
        Do not mention the memory system unless the user asks about it.

        Keep responses clear, natural, and helpful.
        `,
      },
    })

    res.json({
      reply: response.text,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Nova could not process your request. Please try again.',
    })
  }
})

app.listen(3000, () => {
  console.log('Nova server running on http://localhost:3000')
})