const md = require('markdown-it')()

const setupView = () => {
  const clientData = JSON.parse(clientStr)
  const name = clientData.name
  const rawData = document.querySelector('#rawData')
  const content = decodeURIComponent(rawData.innerHTML)
  const result = md.render(content)

  const containerElement = document.querySelector('#mainAppElement')
  containerElement.innerHTML = `
<a href="/">&lt&lt Home</a>
<div class="container" style="margin-top: 20px;">
  <div class="d-flex justify-content-between">
    <h1>
      ${name}
    </h1>

    <div>
      <a href="/notes/${name}/edit">
        <button class="btn btn-primary">Edit</button>
      </a>
      <button class="btn btn-danger deleteButton">Delete</button>
    </div>

  </div>
  <hr>

  <div class="row">
    <div class="col-6 offset-3 note-content">
      ${result}
    </div>
  </div>
</div>
  `

  const deleteButton = document.querySelector('.deleteButton')
  deleteButton.addEventListener('click', () => {
    if (confirm(`You sure you want to delete ${name}`)) {
      window.location = `/notes/${name}/delete`
    }
  })

}

module.exports = setupView
