const fs = require('fs')

exports.saveJSONToFile = async function (data, filename) {
  try {
    const jsonString = JSON.stringify(data, null, 2) // Indent with 2 spaces
    await fs.writeFile(filename, jsonString, 'utf-8')
    console.log(`JSON data saved to ${filename}`)
  } catch (error) {
    console.error(`Error saving JSON data: ${error}`)
  }
}
