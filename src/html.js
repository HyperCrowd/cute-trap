const { getImage } = require('./image')

exports.getHtml = async function getHtml (identifier) {
  return `<!DOCTYPE html>
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
    <img src="${await getImage()}">

    <script>
      const imagePromise = import('./image.js')
        .then(image => image.load())

      imagePromise
        .then(image => image.get())
        .then(image => {
          fetch('/getImage?i=${identifier || ''}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(image)
          })
        })
    </script>
</body>
</html>`
}
