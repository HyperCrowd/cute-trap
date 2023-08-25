const fs = require('fs')
const path = require('path')

const picturePath = path.resolve(__dirname, '../images/animals2-6.png')
let pictureBase64

/**
 *
 */
exports.getImage = async function getImage (path = picturePath) {
  return new Promise((resolve) => {
    if (pictureBase64 !== undefined) {
      return resolve(pictureBase64)
    }

    fs.readFile(path, (err, data) => {
      if (err) {
        console.error('Error reading image file:', err)
        return
      }

      const base64Image = Buffer.from(data).toString('base64')
      const mimeType = 'image/png'

      pictureBase64 = `data:${mimeType};base64,${base64Image}`
      resolve(pictureBase64)
    })
  })
}
