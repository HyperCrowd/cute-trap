const http = require('http')

const cliPort = parseInt(process.env.PORT) || 3000

/**
 *
 */
exports.startHttp = async function (router, port = cliPort) {
  return new Promise(resolve => {
    const server = http.createServer(router)

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`)
      resolve()
    })
  })
}
