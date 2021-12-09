import { createServer } from 'net'
import process from 'process'
import help from './helpers/help'
import users from '../data/users.json'
import path from 'path'
import fs from 'fs'

import RETR from './commands/RETR'

type User = {
  name: string
}

type ResultCommands = {
  USER?: string
  PASS?: string
  LIST?: string
  CWD?: string
  RETR?: string
  STOR?: string
  PWD?: string
  HELP?: string
  QUIT?: string
}

export function launch(port: number) {
  const server = createServer((socket) => {
    const resultCommands: ResultCommands = {}
    console.log('new connection.')
    socket.on('data', (data) => {
      const message = data.toString()

      const [command, ...args] = message.trim().split(' ')
      console.log(command, args)
      console.log(resultCommands)

      resultCommands[command] = `${args[0]}`

      switch (command) {
        case 'USER':
          let user = users.find((user) => user.name === args[0])
          if (!user) {
            socket.write('430 Invalid username or password, proceed.\r\n')
            break
          }
          socket.write('331 User name okay, need password, proceed.\r\n')
          break
        case 'PASS':
          const userName = resultCommands?.USER
          let inputPassword = resultCommands?.PASS
          const password = users.find(
            (user) => user.name === userName
          )?.password
          if (password !== inputPassword) {
            socket.write('430 Invalid username or password, proceed.\r\n')
            break
          }
          socket.write('230 User logged in thanks to password, proceed.\r\n')
          break
        case 'LIST':
          let filenames = fs.readdirSync(process.cwd())
          let files = ''
          filenames.forEach((file) => {
            console.log('File:', file)
            files = files + ' ' + file
          })
          socket.write(`226 ${files} \r\n`)
          break
        case 'CWD':
          const inputDirectory = args[0]
          if (!inputDirectory) {
            socket.write('500 print directory')
            break
          }

          const newPath = path.join(process.cwd(), inputDirectory)
          if (fs.existsSync(newPath) && !fs.statSync(newPath).isFile()) {
            process.chdir(newPath)
            socket.write(`250 change current directory\r\n`)
            break
          }
          socket.write(`500 directory not found try again\r\n`)
          break
        case 'RETR':
          const p = path.join(process.cwd(), args[0])
          if (fs.existsSync(p) && fs.statSync(p).isFile()) {
            RETR(p)
            break
          }
          socket.write(`500 file not found\r\n`)
          break
        case 'STOR':
          socket.write('226 client to the server\r\n')
          break
        case 'PWD':
          socket.write(`257 ${process.cwd()}\r\n`)
          break
        case 'HELP':
          socket.write(`214 ${help()}\r\n`)
          break
        case 'QUIT':
          socket.write('221 quit\r\n')
          break
        case 'TYPE':
          socket.write('200 \r\n')
          break
        default:
          socket.write('500 command not found')
      }
    })
    socket.write('220 FTP Server is ready')
  })

  server.listen(port, () => {
    console.log(`My app is listening http://localhost:${port}...`)
  })
}
