const { URL } = require('url')
const { addFingerprint, startFingerprints } = require('./fingerprints')
const { getHtml } = require('./html')
const { getJs } = require('./js')
const { startHttp } = require('./http')

async function main () {
  startFingerprints()

  startHttp(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`)
    const queryParameters = parsedUrl.searchParams
    const identifier = queryParameters.get('i')
    let body = ''

    switch (parsedUrl.pathname) {
      /**
       *
       */
      case '/image.js':
        res.setHeader('Content-Type', 'application/javascript')
        res.end(await getJs('image.js'))
        break

      /**
       *
       */
      case '/getImage':
        req.on('data', chunk => {
          // Stitch body
          body += chunk.toString()
        })

        req.on('end', () => {
          // A new fingerprint is ready to be saved
          addFingerprint(body, req, parsedUrl.href, identifier)
          res.statusCode = 200
          res.end()
        })
        break

      /**
       *
       */
      case '/':
        res.setHeader('Content-Type', 'text/html')
        res.end(await getHtml(identifier))
        break

      /**
       *
       */
      default:
        res.statusCode = 404
        res.end('Not Found')
        break
    }
  })
}

main()
