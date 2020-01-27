const express = require('express')
const fs = require('fs')
const path = require('path')
const md = require('markdown-it')()
const simpleGit = require('simple-git/promise')(path.resolve(`${__dirname}/data`))
const app = express()
app.set('views', path.resolve(`${__dirname}/views`))
app.set('view engine', 'ejs')
app.use(express.urlencoded())
app.use(express.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('hello')
})

const renderErrorPage = (err, res, json) => {
  if (err) {
    console.log('error', err)
    if (json) {
      return res.json({ error: err })
    } else {
      res.sendFile(path.resolve(`${__dirname}/public/error.html`))
    }
  }
  return !!err
}
const excludedNames = {
  '.git': true
}

app.get('/notes', async (req, res) => {
  fs.readdir(`./data`, (err, files) => {
    if (renderErrorPage(err, res)) {
      return
    }
    const notes = files.filter(note => !excludedNames[note])
    let content = notes.reduce((acc, note) => {
      return acc + `
  <a href='/notes/${note}' class='list-group-item list-group-item-action flex-column align-items-start'>
    <div class='d-flex w-100 justify-content-between'>
      <h5 class='mb-1'>${note}</h5>
      <small>3 days ago</small>
    </div>
    <p class='mb-1'>subtext1</p>
    <small>subtext2</small>
  </a>
        `
    }, `<div class="list-group">`)
    content += '</div>'
    const headerAction = `
    <a href="/notes/new">
      <button class="btn btn-primary">New</button>
    </a>
    `
    res.render('note', { data: { name: 'All Files', content, headerAction } })
  })
})

app.get('/notes/new', async (req, res) => {
  const scripts = `
    <script src="/edit.js"></script>
    `
  res.render('edit', { data: { name: 'Create New', content: '', scripts } })
})

app.get('/notes/:name', async (req, res) => {
  const notePath = `./data/${req.params.name}`
  fs.readFile(notePath, (err, data) => {
    if (renderErrorPage(err, res)) {
      return
    }
    const content = md.render(data.toString())
    const headerAction = `
    <a href="/notes/${req.params.name}/edit">
      <button class="btn btn-primary">Edit</button>
    </a>
    `

    const scripts = `
    <script src="/changeLogs.js"></script>
    `
    res.render('note', {
      data: {
        name: req.params.name, content, headerAction, scripts
      }
    })
  })
})

app.get('/notes/:name/edit', async (req, res) => {
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

app.get('/show/:commit/:name', async (req, res) => {
  await simpleGit.checkout(req.params.commit)
  const name = req.params.name
  fs.readFile(`./data/${name}`, (err, data) => {
    simpleGit.checkout('master')
    if (renderErrorPage(err, res)) {
      return
    }
    const content = md.render(data.toString())
    res.render('note', { data: { name, content } })
  })
})

app.post('/api/notes', async (req, res) => {
  const fileName = `./data/${req.body.name}`
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

app.put('/api/notes/:note', async (req, res) => {
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

app.get('/api/logs/:name', async (req, res) => {
  const logs = await simpleGit.log({ file: req.params.name })
  res.json(logs)
})

app.listen(process.env.PORT || 3030) // notes.slacker.club
