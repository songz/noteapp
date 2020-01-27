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

app.get('/show/:commit/:name', async (req, res) => {
  await simpleGit.checkout(req.params.commit)
  const name = req.params.name
  fs.readFile(`./data/${name}`, (err, data) => {
    simpleGit.checkout('master')
    if (err) {
      console.log('error', err)
      return res.sendFile(path.resolve(`${__dirname}/public/error.html`))
    }
    const content = md.render(data.toString())
    res.render('note', { name, content })
  })
})

app.post('/api/notes', async (req, res) => {
  console.log('wtf', req.body)
  const fileName = `./data/${req.body.name}`
  fs.writeFile(fileName, req.body.value, async (error) => {
    if (error) {
      return res.json({ error })
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
