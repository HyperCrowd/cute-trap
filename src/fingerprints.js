const UAParser = require('ua-parser-js')
const crypto = require('crypto');
const fs = require('fs')

let fingerprints
let shouldSave = false

/**
 *
 */
async function loadFingerprints (filePath) {
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

/**
 *
 */
exports.addFingerprint = async function (body, req, url, identifier) {
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

  fingerprintData.components.canvas.value.geometry = crypto.createHash('md5').update(fingerprintData.components.canvas.value.geometry).digest('hex')
  fingerprintData.components.canvas.value.text = crypto.createHash('md5').update(fingerprintData.components.canvas.value.text).digest('hex')
  delete fingerprintData.components.webGlExtensions

  // Process the fingerprint data
  const request = {
    id: identifier,
    fingerprints: fingerprintData,
    time: new Date().toISOString(),
    ip,
    browserInfo,
    url,
    headers: req.headers,
    forwardedIp,
    forwardedProto
  }

  console.log(identifier)
  console.log(request)

  if (fingerprints[identifier] === undefined) {
    fingerprints[identifier] = []
  }

  fingerprints[identifier].push(request)

  shouldSave = true

  return request
}

/**
 *
 */
exports.startFingerprints = async function (fileName = 'fingerprints.json') {
  fingerprints = await loadFingerprints(fileName)

  setInterval(() => {
    if (shouldSave === true) {
      fs.writeFileSync(fileName, JSON.stringify(fingerprints))
      shouldSave = false
    }
  }, 1000)
}
