const util = require('util')
const exec = util.promisify(require('child_process').exec)

/**
 *
 */
exports.makeCurlRequest = async function makeCurlRequest (command) {
  try {
    const { stdout, stderr } = await exec(command)

    if (stderr) {
      console.error(stderr)
    }

    return JSON.parse(stdout)
  } catch (error) {
    console.error(error)
  }
}
