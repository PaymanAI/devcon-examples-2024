const generateWordArray = (text: string) => {
  const wordMap: Record<string, number> = {}

  const words = text.split(/\s+/) // Split by whitespace
  for (const word of words) {
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, '') // Clean punctuation
    if (cleanWord.length > 3) {
      wordMap[cleanWord] = (wordMap[cleanWord] || 0) + 1
    }
  }

  return Object.entries(wordMap)
}

export const WordCloudDisplay = (text: string) => {
  const array = generateWordArray(text)

  return (
    <>
      <script>
        generateWordCloud([{array.map(v => `["${v[0]}",${v[1]}],`)}]);
      </script>
      <canvas id='wordcloud-canvas' width='400' height='400' />
    </>
  )
}
