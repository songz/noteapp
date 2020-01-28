/* global fetch moment */
const startLogDisplay = () => {
  const [fileName] = window.location.pathname.split('/').splice(2)
  fetch(`/api/logs/${fileName}`).then(r => r.json()).then(data => {
    const commits = data.all || []
    if (!commits.length) return
    let startContent = `
    <div class="logContainer list-group">
    `
    console.log('commits', commits)
    startContent = commits.reduce((acc, commit) => {
      const { hash, message, date, body } = commit
      const [dDate, dTime, dDiff] = date.split(' ')
      const ago = moment(`${dDate} ${dTime}${dDiff}`).fromNow()
      const hashDisplay = `${hash.substr(0, 20)}...`
      return acc + `
  <a href='/show/${hash}/${fileName}/edit' class='list-group-item list-group-item-action flex-column align-items-start'>
    <div class='d-flex w-100 justify-content-between'>
      <h5 class='mb-1'>${hashDisplay}</h5>
      <small>${ago}</small>
    </div>
    <p class='mb-1'>${message}</p>
    <small>${body || ''}</small>
  </a>
      `
    }, startContent)

    startContent += `
      </div>
      <h5 class="header">Logs &gt;&gt;</h5>
    `
    logDisplay.innerHTML = startContent

    const logHeader = logDisplay.querySelector('.header')
    logHeader.addEventListener('click', () => {
      console.log('ouch')
      if (logDisplay.classList.contains('open')) {
        logHeader.innerText = 'Logs >>'
        logDisplay.classList.remove('open')
        return
      }
      logHeader.innerText = 'Logs <<'
      logDisplay.classList.add('open')
    })
  })
}

const logDisplay = document.querySelector('#logDisplay')
if (logDisplay) {
  startLogDisplay()
}
