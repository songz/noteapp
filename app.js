const express = require('express')
const fs = require('fs')
const util = require('util')
const path = require('path')
const multer = require('multer')
const {setupGit} = require('./lib/git')
const { spawn } = require('child_process')
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

app.get('/search/:query', (req, res) => {
  const child = spawn('rg', [req.params.query, './data', '-im', '1']);
  child.stdout.pipe(res);
})

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

    const content = JSON.stringify(notesInfo)
    res.render('notes', { data: {
      content,
      path: 'home'
    } })
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
