function generateWordCloud(wordArray) {
  if (!wordArray || !wordArray.length) {
    return
  }

  const canvas = document.getElementById('wordcloud-canvas')

  if (canvas) {
    WordCloud(canvas, {
      list: wordArray,
      gridSize: 16,
      weightFactor: 12,
      fontFamily: 'Times, serif',
      color: 'random-dark',
      rotateRatio: 0.5,
      backgroundColor: '#fff',
    })
  }
}
