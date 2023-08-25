const { makeCurlRequest } = require('./curl')

exports.checkIpInfo = async function (ip, key = process.env.IPINFO_TOKEN) {
  const endpoint = `curl -s --request GET --url "https://ipinfo.io/${ip}?token=${key}"`
  const result = await makeCurlRequest(endpoint)
  return result
}
