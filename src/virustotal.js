const { makeCurlRequest } = require('./curl')

exports.checkVirusTotal = async function (ip, key = process.env.VIRUSTOTAL_KEY) {
  const endpoint = `curl -s --request GET --header "x-apikey: ${key}" --url https://www.virustotal.com/api/v3/ip_addresses/${ip}`
  const result = await makeCurlRequest(endpoint)

  // delete result.data.attributes.whois

  return result.data.attributes.last_analysis_stats
}
