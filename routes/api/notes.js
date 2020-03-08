const express = require('express')
const fs = require('fs')
const path = require('path')
const {getGit} = require('../../lib/git')
const {renderErrorPage} = require('../../lib/render')

const router = express.Router()

router.post('/', async (req, res) => {
  const simpleGit = getGit()
  const fileName = `./data/${req.body.name}`
  console.log('saving file... path is', fileName)
  fs.writeFile(fileName, req.body.value, async (err) => {
    if (renderErrorPage(err, res, true)) {
      return
    }
    try {
      await simpleGit.add(req.body.name)
      await simpleGit.commit('initial file')
    } catch (err) {
      console.log(err)
    }
    res.json(req.body)
  })
})

router.put('/:note', async (req, res) => {
  const simpleGit = getGit()
  const fileName = `./data/${req.params.note}`
  fs.writeFile(fileName, req.body.value, async (err) => {
    if (renderErrorPage(err, res, true)) {
      return
    }
    try {
      await simpleGit.add(req.params.note)
      await simpleGit.commit(req.body.name || 'no description')
    } catch (err) {
      console.log(err)
    }
    res.json(req.body)
  })
})

router.get('/:name/logs', async (req, res) => {
  const simpleGit = getGit()
  const logs = await simpleGit.log({ file: req.params.name })
  res.json(logs)
})

module.exports = router
