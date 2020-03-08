/* globals clientPath */
const { setupChangeLogs } = require('./changeLogs')
const { setupDropZone } = require('./dropZone')

const setupHome = require('./home')
const setupNew = require('./new')
const setupEdit = require('./edit')
const setupView = require('./view')

const startApp = () => {
  if (clientPath === 'home') {
    return setupHome()
  }
  if (clientPath === 'new') {
    setupDropZone()
    return setupNew()
  }
  if (clientPath === 'edit') {
    setupDropZone()
    return setupEdit()
  }
  if (clientPath === 'view') {
    setupView()
    return setupChangeLogs()
  }
}
startApp()
