const fs = require('fs')

/**
 *
 */
exports.getJs = async function getJs (jsPath, res) {
  return new Promise((resolve, reject) => {
    fs.readFile(jsPath, 'utf8', (err, content) => {
      if (err) {
        res.statusCode = 500
        res.end('Internal Server Error')
        return reject(err)
      }

      return resolve(content)
    })
  })
}
