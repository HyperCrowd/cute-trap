const { resolve } = require('path')
const fs = require('fs').promises

const validFilename = /^[^./\\]+$/
const downloadPath = resolve(__dirname, '../downloads')
/**
 *
 */
exports.saveJSONToFile = async function (data, filename) {
  try {
    const jsonString = JSON.stringify(data, null, 2) // Indent with 2 spaces
    await fs.writeFile(downloadPath + '/' + filename, jsonString, 'utf-8')
  } catch (error) {
    console.error(`Error saving JSON data: ${error}`)
  }
}

/**
 *
 */
function isValidFilename (filename) {
  return validFilename.test(filename)
}

/**
 *
 */
exports.checkAndOpenJSON = async function (filename) {
  if (!isValidFilename(filename)) {
    return false
  }

  filename = downloadPath + '/' + filename + '.json'

  try {
    await fs.access(filename) // Check if the file exists
    const fileContent = await fs.readFile(filename, 'utf-8') // Read file content as UTF-8
    return fileContent
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false
    } else {
      return false
    }
  }
}
