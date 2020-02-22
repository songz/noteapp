/* globals clientData */
const moment = require('moment')
const initSearch = require('./search')

const noteMap = {}

const contentStr = clientData.reduce((acc, note, idx) => {
  const title = note.name.toLowerCase()
  noteMap[title] = note.name
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

module.exports = () => {
  const containerElement = document.querySelector('#mainAppElement')
  containerElement.innerHTML = `
    <div class="row">
      <div class="col-12">
        <div class="card-columns">
        ${contentStr}
      </div>
      <hr>
      </div>
    </div>
  `
  initSearch(noteMap)
}
