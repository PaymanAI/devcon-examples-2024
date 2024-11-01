const returnToStart = () => {
  document.location.href = '/'
}

let timeout
// biome-ignore lint/correctness/noUnusedVariables: used as JS call in browser
const resetScreen = length => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    returnToStart()
  }, length)
}

const simulateTypingNode = (source, destination) => {
  return new Promise(resolve => {
    const text = source.textContent
    let i = 0
    const interval = setInterval(() => {
      if (i >= text.length) {
        clearInterval(interval)
        scrollIntoView()
        resolve()
      } else {
        destination.innerHTML += text[i]
        i++
      }
    }, 15)
  })
}

const typeNode = async (node, element) => {
  // If node is a text node, type its text content
  if (node.nodeType === Node.TEXT_NODE) {
    await simulateTypingNode(node, element)
    return
  }

  // If node is an element node, copy it and append it to the target element
  if (node.nodeType === Node.ELEMENT_NODE) {
    const clone = document.createElement(node.tagName)
    element.appendChild(clone)

    // Copy attributes
    for (const attr of node.attributes) {
      clone.setAttribute(attr.name, attr.value)
    }

    // Type each child node sequentially
    for (const child of node.childNodes) {
      await typeNode(child, clone)
    }
  }
}

// biome-ignore lint/correctness/noUnusedVariables: used as JS call in browser
function simulateTyping() {
  const source = document.getElementById('typing-source')
  const element = document.getElementById('simulateWithTyping')

  // Clear existing content
  element.innerHTML = ''

  // Start typing each node in the source element
  ;(async () => {
    for (const child of source.childNodes) {
      await typeNode(child, element)
    }
  })()
}

function scrollIntoView() {
  const element =
    document.getElementById('tip-link') ??
    document.getElementById('last-chat-item')
  const conversation = document.getElementById('conversation')

  if (!(element && conversation)) {
    return
  }

  if (
    element.offsetTop + element.clientHeight >
    conversation.scrollTop + conversation.clientHeight
  ) {
    conversation.scrollTop = conversation.scrollHeight
  }
}
