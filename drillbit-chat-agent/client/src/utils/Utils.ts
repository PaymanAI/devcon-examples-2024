export const simulateTyping = (
  text: string,
  callback: (typedText: string) => void,
) => {
  let i = 0
  const interval = setInterval(() => {
    i++
    callback(text.slice(0, i))
    if (i === text.length) {
      clearInterval(interval)
    }
  }, 30)
}
