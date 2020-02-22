/* globals clientPath */

const setupHome = require('./home')

const startApp = () => {
  if (clientPath === 'home') {
    return setupHome()
  }
}
startApp()
