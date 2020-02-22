/* globals clientStr */
const moment = require('moment')
const initSearch = require('./search')

const noteMap = {}

module.exports = () => {
  const clientData = JSON.parse(atob(clientStr)) || []
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

  const containerElement = document.querySelector('#mainAppElement')
  containerElement.innerHTML = `
  <div class="d-flex justify-content-between">
    <h1>
        All Files
      </h1>
      <a href="/notes/new">
        <button class="btn btn-primary">New</button>
      </a>
    </div>
    <hr>
      <input type="text" style="width: 100%" id="searchBox">
        <div id="resultListContainer"></div>

        <hr />

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
