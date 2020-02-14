const gitLib = require('simple-git/promise')
let simpleGit;

const setupGit = (path) => {
  simpleGit = gitLib(path)
  return simpleGit
}

const getGit = () => {
  return simpleGit
}

module.exports = {
  setupGit, getGit
}

