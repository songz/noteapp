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
}

module.exports = {
  genHeaderHTML
}
