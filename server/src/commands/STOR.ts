import fs from 'fs'
import path from 'path'

const STOR = (socket: any, args: any) => {
  const inputFile = args[0]
  if (!inputFile) {
    socket.write('500 file not found')
    return
  }
  const p = path.join(process.cwd(), inputFile)
  if (fs.existsSync(p) && fs.statSync(p).isFile()) {
    const file = fs.readFileSync(p, { encoding: 'utf8', flag: 'r' })
    socket.write(`250 path=${p} file=${file}\r\n`)
    return
  }
  socket.write('226 file not found\r\n')
  return
}

export default STOR
