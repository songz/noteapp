const express = require('express')
const fs = require('fs')
const util = require('util')
const moment = require('moment')
const path = require('path')
const multer = require('multer')
const {setupGit} = require('./lib/git')
const {renderErrorPage} = require('./lib/render')
const noteApiRouter = require('./routes/api/notes')
const noteViewRouter = require('./routes/views/notes')

const simpleGit = setupGit(path.resolve(`${__dirname}/data`))

const getFileStat = util.promisify(fs.stat)

const app = express()

const assetPath = '.noteapp-assets'
app.set('views', path.resolve(`${__dirname}/views`))
app.set('view engine', 'ejs')
app.use(express.urlencoded())
app.use(express.json())
app.use(express.static('public'))
app.use('/assets', express.static(`data/${assetPath}`))

const storage = multer.diskStorage({
  destination: `data/${assetPath}`,
  filename: function (_, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/ /g, '-')}`)
  }
})
const upload = multer({storage})

const excludedNames = {
  '.git': true,
  '.noteapp-assets': true,
}

app.post('/api/files', upload.any('assets'), (req, res) => {
  let allNames = ''
  const filePaths = req.files.map(f => {
    allNames += `, ${f.filename}`
    return {
      name: f.filename,
      path: `/assets/${f.filename}`,
      isImage: f.mimetype.includes('image')
    }
  })
  Promise.all(
    filePaths.map(f => simpleGit.add(`${assetPath}/${f.name}`))
  ).then(() => {
    simpleGit.commit(`add files ${allNames}`)
  })
  res.json(filePaths)
})

app.get(['/', '/notes'], (req, res) => {
  fs.readdir(`./data`, async (err, files) => {
    if (renderErrorPage(err, res)) {
      return
    }
    const notes = files.filter(note => !excludedNames[note])

    const noteResults = await Promise.all(notes.map(fname => {
      return getFileStat(`./data/${fname}`)
    }))
    const notesInfo = noteResults.map((info, idx) => {
      return {
        ...info,
        name: notes[idx]
      }
    }).sort((a, b) => b.mtimeMs - a.mtimeMs)
    let content = notesInfo.reduce((acc, note, idx) => {
      return acc + `
    <div class="card">
    <div class='card-body'>
      <a href='/notes/${note.name}'>
        <div class="d-flex justify-content-between">
            <h5 class='card-title'>${note.name}</h5>

            <small class="text-muted">
      ~${Math.floor(note.size / 1000)} Kb
            </small>
        </div>
      </a>
      <p class="card-text">
      <small class="text-muted">
Modified ${moment(note.mtimeMs).fromNow()}
      </small>
      </p>
    </div>
    </div>
        `
    }, '')
    const headerAction = `
    <a href="/notes/new">
      <button class="btn btn-primary">New</button>
    </a>
    `
    res.render('notes', { data: { name: 'All Files', content, headerAction } })
  })
})

app.get('/raw/:name', async (req, res) => {
  const notePath = `./data/${req.params.name}`
  fs.readFile(notePath, (err, data) => {
    if (renderErrorPage(err, res)) {
      return
    }
    res.send( data.toString() )
  })
})

app.get('/show/:commit/:name/edit', async (req, res) => {
  await simpleGit.checkout(req.params.commit)
  const name = req.params.name
  fs.readFile(`./data/${name}`, (err, data) => {
    simpleGit.checkout('master')
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

app.use('/notes', noteViewRouter)
app.use('/api/notes', noteApiRouter)

app.get('/api/logs/:name', async (req, res) => {
  const logs = await simpleGit.log({ file: req.params.name })
  res.json(logs)
})

app.listen(process.env.PORT || 3030) // notes.slacker.club
