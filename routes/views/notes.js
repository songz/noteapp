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
    const content = { name: req.params.name }
    res.render('notes', {
      data: {
        path: 'view',
        content: JSON.stringify(content),
        rawData: encodeURIComponent(data.toString())
      },
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
    const content = {
      name: req.params.name
    }
    res.render('notes', {
      data: {
        path: 'edit',
        content: JSON.stringify(content),
        rawData: encodeURIComponent(data.toString())
      }
    })
  })
})

router.get('/:name/edit/:commit', async (req, res) => {
  const simpleGit = getGit()
  await simpleGit.checkout(req.params.commit)
  const name = req.params.name
  const notePath = `./data/${req.params.name}`
  fs.readFile(notePath, (err, data) => {
    // checkout master MUST be the FIRST command to never mess up `data` folder
    simpleGit.checkout('master')
    if (renderErrorPage(err, res)) {
      return
    }
    const content = {
      name: req.params.name
    }
    res.render('notes', {
      data: {
        path: 'edit',
        content: JSON.stringify(content),
        rawData: encodeURIComponent(data.toString())
      }
    })
  })
})

module.exports = router

