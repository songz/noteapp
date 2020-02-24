const express = require('express')
const fs = require('fs')
const path = require('path')
const {getGit} = require('../../lib/git')
const {renderErrorPage} = require('../../lib/render')

const router = express.Router()

router.get('/new', async (req, res) => {
  res.render('notes', { data: {
    content: '', path: 'new'
  } })
})

router.get('/:name', async (req, res) => {
  const notePath = `./data/${req.params.name}`
  fs.readFile(notePath, (err, data) => {
    if (renderErrorPage(err, res)) {
      return
    }
    const content = {
      name: req.params.name, content: data.toString('base64'),
    }
    res.render('notes', {
      data: {
        path: 'view',
        content: JSON.stringify(content)
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
    const content = data.toString('base64')
    res.render('notes', { data: {
      name: req.params.name,
      content, path: 'edit'
    } })
  })
})

module.exports = router

