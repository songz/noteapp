/* globals clientPath */

const setupHome = require('./home')
const setupNew = require('./new')

const startApp = () => {
  if (clientPath === 'home') {
    return setupHome()
  }
  if (clientPath === 'new') {
    return setupNew()
  }
}
startApp()
