const dropZone = document.querySelector('.dropZone')
const setupDropZone = () => {
  createDropEvent = (clear=true) => {
    return (e) => {
      if (clear) {
        dropZone.classList.remove('focused')
      } else {
        dropZone.classList.add('focused')
      }
      e.preventDefault()
      e.stopPropagation()
      return false
    }
  }

  const clearDropEvent = createDropEvent(true)

  dropZone.addEventListener('dragenter', createDropEvent(false))
  dropZone.addEventListener('dragover', createDropEvent(false))
  dropZone.addEventListener('dragleave', clearDropEvent)
  dropZone.addEventListener('drop', (e) => {
    const files = e.target.files || e.dataTransfer.files
    if (!files.length) {
      return
    }

    const formData = new FormData()
    for(let i = 0; i < files.length; i ++) {
      formData.append('assets[]', files[i], files[i].name)
    }
    fetch('/api/files', {
      method: 'POST',
      body: formData
    }).then( r => r.json() ).then(arr => {
      const source = document.querySelector('.source')
      const value = source.value || ''
      source.value = arr.reduce((acc, n) => {
        const img = n.isImage ? '!' : ''
        return acc + `\n${img}[](${n.path})`
      }, value)
      source.focus()
      if (md && resultElement) {
        const result = md.render(source.value)
        resultElement.innerHTML = result
      }
    })
    return clearDropEvent(e)
  })
}

if (dropZone) {
  setupDropZone()
}
