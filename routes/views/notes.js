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
    const content = md.render(data.toString())
    const headerAction = `
    <div>
    <a href="/notes/${req.params.name}/edit">
      <button class="btn btn-primary">Edit</button>
    </a>
    <button class="btn btn-danger deleteButton">Delete</button>
    </div>
    `

    const scripts = `
    <script src="/changeLogs.js"></script>
    <script>
    const deleteButton = document.querySelector('.deleteButton')
    deleteButton.addEventListener('click', () => {
    if (confirm("You sure you want to delete ${req.params.name}")) {
      window.location = "/notes/${req.params.name}/delete"
    }
    })
    </script>
    `
    res.render('note', {
      data: {
        name: req.params.name, content, headerAction, scripts
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

