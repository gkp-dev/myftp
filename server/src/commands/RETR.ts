import fs from 'fs'
import { createConnection } from 'net'

const RETR = (path: string) => {
  console.log(path)
  const socket = createConnection({ port: 6565, host: 'locahost' }, () => {
    console.log('download socket connected')
    socket.write(`RETR ${path}`)
  })

  socket.on('data', (data) => {
    if (!path) {
      let dest = fs.createWriteStream(path)
      dest.pipe(socket)
      console.log('download finish closing socket ...')
    }
    console.log('hello')
  })
}

export default RETR
