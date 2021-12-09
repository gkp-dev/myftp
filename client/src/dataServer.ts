import { createServer } from 'net'

const server = createServer((socket) => {
  server.on('data', (data) => {
    const message = data.toString()
    const [command, ...args] = message.trim().split(' ')
  })
})

const launchDataServer = (port: number) => {
  server.listen(port, () => {
    console.log(`My app is listening http://localhost:${port}...`)
  })
}

export default launchDataServer
