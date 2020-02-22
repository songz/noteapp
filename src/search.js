const resultContainer = document.querySelector('#resultListContainer')
const searchBox = document.querySelector('#searchBox')
const allNotes = document.querySelectorAll('.card-columns .card-title')
let resultElements = []
let noteMap = {}

const search = () => {
  const searchQuery = searchBox.value
  if (searchQuery.length < 2) return
  fetch(`/search/${searchQuery}`).then( r=> r.text() ).then(data => {
    // invalidate old requests
    if( searchBox.value !== searchQuery) return
    const dataArr = data.split('\n').filter( d => d ).map( d => {
      const result = d.substr(5) // get rid of data/ prefix
      const resultArr = result.split(':')
      const title = resultArr.shift()
      const match = resultArr.join(':')
      return {
        title, match
      }
    })
    resultContainer.innerHTML = ''
    const newTitleMap = {...noteMap}
    resultElements = dataArr.map( (obj, idx) => {
      delete newTitleMap[obj.title.toLowerCase()]
      return new Result(obj.title, obj.match, idx)
    })
    Object.keys(newTitleMap).forEach( title => {
      if (!title.includes(searchQuery.toLowerCase())) {
        return
      }
      resultElements.push(
        new Result(newTitleMap[title], '', resultElements.length)
      )
    })
  })
}

function Result(name, value, idx) {
  const div = document.createElement('div')
  div.className = 'resultContainer'
  if (!idx) {
    div.className += ' selected'
  }
  div.innerHTML = `
  <p>
    <span class="title">
      ${name}:
    </span>
    ${value}
  </p>
  `
  div.addEventListener('click', () => {
    this.select()
  })

  resultContainer.append(div)
  this.select = () => {
    window.location = `/notes/${name}`
  }
}

searchBox.addEventListener('keyup', (e) => {
  console.log(e.key)
  if (e.key === 'Enter') {
    return resultElements[0].select()
  }
  search()
})

const initSearch = (titleMap) => {
  searchBox.focus()
  noteMap = titleMap
}

module.exports = initSearch
