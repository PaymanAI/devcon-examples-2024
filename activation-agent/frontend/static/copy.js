function copyToClipboard(id) {
  var elem = document.getElementById(id)
  var text = elem.innerText
  navigator.clipboard.writeText(text)

  var tooltip = document.getElementById('tooltip')
  tooltip.style.visibility = 'visible'
  setTimeout(() => {
    tooltip.style.visibility = 'hidden'
  }, 2000)
}
