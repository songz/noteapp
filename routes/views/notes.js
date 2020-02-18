const express = require('express')
const fs = require('fs')
const md = require('markdown-it')()
const path = require('path')
const {getGit} = require('../../lib/git')
const {renderErrorPage} = require('../../lib/render')

const router = express.Router()

router.get('/new', async (req, res) => {
  const scripts = `
    <script src="/edit.js"></script>
    `
  res.render('edit', { data: { name: 'Create New', content: '', scripts } })
})

router.get('/:name', async (req, res) => {
  const notePath = `./data/${req.params.name}`
  fs.readFile(notePath, (err, data) => {
    if (renderErrorPage(err, res)) {
      return
    }
    res.render('note', {
      data: {
        name: req.params.name, content: data.toString('base64')
      }
    })
  })
})

router.get('/:name/delete', (req, res) => {
  const simpleGit = getGit()
  const notePath = path.resolve(`./data/${req.params.name}`)
  fs.unlink(notePath, async (err, data) => {
    if (renderErrorPage(err, res)) {
      return
    }
    try {
      await simpleGit.add(req.params.name)
      await simpleGit.commit(`remove file ${req.params.name}`)
    } catch (err) {
      console.log(err)
    }
    return res.redirect('/')
  })
})

router.get('/:name/edit', async (req, res) => {
  const notePath = `./data/${req.params.name}`
  fs.readFile(notePath, (err, data) => {
    if (renderErrorPage(err, res)) {
      return
    }
    const content = data.toString()
    const scripts = `
    <script src="/edit.js"></script>
          `
    res.render('edit', { data: { name: req.params.name, content, scripts } })
  })
})

router.get('/:name/delete', (req, res) => {
  const notePath = `./data/${req.params.name}`
  fs.unlink(notePath, async (err, data) => {
    if (renderErrorPage(err, res)) {
      return
    }
    try {
      await simpleGit.add(req.params.name)
      await simpleGit.commit(`remove file ${req.params.name}`)
    } catch (err) {
      console.log(err)
    }
    return res.redirect('/')
  })
})
module.exports = router

