const http = require('http')

/**
 *
 */
exports.startHttp = async function (router, port = 3000) {
  return new Promise(resolve => {
    const server = http.createServer(router)

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`)
      resolve()
    })
  })
}
