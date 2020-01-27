const express = require('express')
const fs = require('fs')
const app = express()
app.use(express.static('public'))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('hello')
})

app.post('/api/notes', (req, res) => {
  console.log('wtf', req.body)
  fs.writeFile(`./data/${req.body.name}`, req.body.value, (error) => {
    if (error) {
      return res.json({ error })
    }
    res.json(req.body)
  })
})

app.listen(process.env.PORT || 3030) // notes.slacker.club
