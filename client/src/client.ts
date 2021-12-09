import { createConnection } from 'net'
import { createInterface } from 'readline'
import fs from 'fs'

let currentCommand = ''

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

const prompt = (status?: string, args?: any) => {
  rl.question('> ', (command) => {
    client.write(command)
  })
  handleCommand(status, args)
}

const handleCommand = (status?: string, args?: any) => {
  switch (status) {
    case '221':
      client.end()
      rl.close()
      break
    case '226':
      break
    default:
      break
  }
}

const client = createConnection({ port: 4242 }, () => {
  console.log('client connected.')
})

client.on('data', (data) => {
  const message = data.toString()
  console.log('Message received:', message)

  const [status, ...args] = message.trim().split(' ')

  prompt(status, args)
})

prompt()
