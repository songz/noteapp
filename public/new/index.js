/* global document fetch */

const md = window.markdownit()
const sourceElement = document.querySelector('.source')
const resultElement = document.querySelector('.result-html')

sourceElement.addEventListener('keyup', () => {
  console.log('key up')
  const result = md.render(sourceElement.value)
  resultElement.innerHTML = result
})

const saveElement = document.querySelector('.saveButton')
const noteNameElement = document.querySelector('#noteName')
saveElement.addEventListener('click', () => {
  const name = noteNameElement.value
  const value = sourceElement.value
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name, value
    })
  })
})
