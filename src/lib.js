const getContent = () => {
  const rawData = document.querySelector('#rawData') || {}
  return decodeURIComponent(rawData.innerHTML || '')
}

const getName = () => {
  const clientData = JSON.parse(clientStr)
  return clientData.name
}

module.exports = {getContent, getName}
