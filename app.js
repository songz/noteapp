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
    res.render('note', { name: 'All Files', content })
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
    res.render('note', { name, content })
  })
})

app.post('/api/notes', async (req, res) => {
  console.log('wtf', req.body)
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

app.get('/api/logs/:name', async (req, res) => {
  const logs = await simpleGit.log({ file: req.params.name })
  res.json(logs)
})

app.listen(process.env.PORT || 3030) // notes.slacker.club
