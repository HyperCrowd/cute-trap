const { makeCurlRequest } = require('./curl')

exports.checkTorrents = async function (ip, key = process.env.IKWYD_KEY) {
  const endpoint = `curl -s --url "https://api.antitor.com/history/peer?ip=${ip}&days=30&contents=100&key=${key}"`
  const result = await makeCurlRequest(endpoint)
  return result
}
