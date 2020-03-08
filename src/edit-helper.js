const { getContent, getName } = require('./lib')

const genHeaderHTML = (fileName='') => {
  let name = 'NEW'
  let headerSub = ''
  let placeholder = 'Note Name'
  let inputDesc = 'Quick 1 liner to describe this change'
  if (fileName) {
    name = fileName
    headerSub = '<small>Edit</small>'
    placeholder = 'Commit Message'
    inputDesc = 'Note name. No slash (\ or /) or colon (:) '
  }
  return `
  `
}

const getContainerHTML = (content='', result='') => {
  return `
  `
}

const setupEditablePage = (isEditPage=false) => {
  let name = 'NEW'
  let headerSub = ''
  let placeholder = 'Note Name'
  let inputDesc = 'Quick 1 liner to describe this change'

  let content = ''
  let result = ''

  if (isEditPage) {
    name = getName()
    content = getContent()
    result = md.render(content)
    headerSub = '<small>Edit</small>'
    placeholder = 'Commit Message'
    inputDesc = 'Note name. No slash (\ or /) or colon (:) '
  }
  const headerElement = document.createElement('div')
  const containerElement = document.createElement('div')
  headerElement.className = 'container'
  containerElement.className = 'container full-height'

  headerElement.innerHTML = `
  <h1>
    ${name} ${headerSub}
  </h1>
  <div class="form-row formInput">
    <div class="col-4">
      <input class="form-control _tip" id="noteName" type="input" placeholder="${placeholder}" title="Name for Note">
        <small id="inputDesc" class="form-text">${inputDesc}</small>
      </div>
      <div class="col-2">
        <button class="saveButton btn btn-primary">Create</button>
      </div>
    </div>
  </div>
  <div id="logDisplay"></div>
  <div class="dropZone"></div>
  `

  containerElement.innerHTML = `
  <div class="row full-height">
    <div class="col-6 full-height">
      <textarea class="source full-height">${content}</textarea>
    </div>
    <section class="col-6 full-height">
      <div class="result-html full-height">${result}</div>
      <pre class="hljs result-src full-height"><code class="result-src-content full-height"></code></pre>
      <pre class="hljs result-debug full-height"><code class="result-debug-content full-height"></code></pre>
    </section>
  </div>
  `

  document.body.append(headerElement)
  document.body.append(containerElement)
}

module.exports = {
  genHeaderHTML,
  getContainerHTML,
  setupEditablePage,
}
