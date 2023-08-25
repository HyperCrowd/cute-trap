const { makeCurlRequest } = require('./curl')

exports.checkShodan = async function (ip, key = process.env.SHODAN_KEY) {
  const endpoint = `curl -s --request GET --url "https://internetdb.shodan.io/${ip}?key=${key}"`
  const result = await makeCurlRequest(endpoint)
  return result
}
