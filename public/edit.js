/* global document fetch */

const md = window.markdownit({
  highlight: (str, lang) => {
    lang = lang || 'js'
    if(hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(lang, str, true).value}</code></pre>`

      } catch (__) { }
      return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
    console.log('str ', lang, str)
  }
})
const sourceElement = document.querySelector('.source')
const resultElement = document.querySelector('.result-html')
const saveElement = document.querySelector('.saveButton')
const noteNameElement = document.querySelector('#noteName')
const inputDesc = document.querySelector('#inputDesc')

const isEditPage = () => {
  return (pathArr.length > 2 && pathArr[pathArr.length - 1] === 'edit')
}

let startContent = ''

const render = () => {
  const result = md.render(sourceElement.value)
  resultElement.innerHTML = result
  if (isEditPage() && sourceElement.value !== startContent) {
    inputDesc.classList.add('invalid-feedback')
    inputDesc.innerText = 'Changes detected, please remember to save!'
    noteNameElement.classList.add('is-invalid')
  }
}

const sendRequest = (fileName) => {
  const method = fileName ? 'PUT' : 'POST'
  const name = noteNameElement.value
  const value = sourceElement.value
  startContent = value
  const path = fileName || ''
  fetch(`/api/notes/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name, value
    })
  }).then(d => d.json()).then(() => {
    const noteNameValue = isEditPage() ? fileName : name
    window.location = `/notes/${noteNameValue}`
  })
}

const startEditing = (fileName) => {
  startContent = sourceElement.value
  render()
  saveElement.innerText = 'Save'
  noteNameElement.placeholder = 'Change Description'
  noteNameElement.title = 'Change Description'
  inputDesc.innerText = 'Message to describe your change'
  startApp(fileName)
}

const startApp = (fileName) => {
  saveElement.addEventListener('click', (e) => {
    sendRequest(fileName)
    e.preventDefault()
    return false
  })
}

const pathArr = window.location.pathname.split('/').filter(e => e)
if (isEditPage()) {
  startEditing(pathArr[pathArr.length - 2])
} else {
  startApp()
}

sourceElement.addEventListener('keyup', render)
