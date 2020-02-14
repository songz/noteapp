const path = require('path')

const renderErrorPage = (err, res, json) => {
  if (err) {
    console.log('error', err)
    if (json) {
      return res.json({ error: err })
    } else {
      res.sendFile(path.resolve(`./public/error.html`))
    }
  }
  return !!err
}

module.exports = {
  renderErrorPage
}
