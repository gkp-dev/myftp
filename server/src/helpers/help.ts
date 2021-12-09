const help = (): string => {
  return `
    USER <username>: check if the user exist
    PASS <password>: authenticate the user with a password
    LIST: list the current directory of the server
    CWD <directory>: change the current directory of the server
    RETR <filename>: transfer a copy of the file FILE from the server to the client
    STOR <filename>: transfer a copy of the file FILE from the client to the server
    PWD: display the name of the current directory of the server
    HELP: send helpful information to the client
    QUIT: close the connection and stop the program
`
}

export default help
