export const DistributionDisplay = ({
  title,
  score,
  positive,
  negative,
}: { title: string; score: number; positive: string; negative: string }) => {
  return (
    <div class='card'>
      <h2>{title}</h2>
      <div class='titles'>
        <span class='negative'>{negative}</span>
        <span class='positive'>{positive}</span>
      </div>
      <div class='bar-bg'>
        <span class='bar-fg' style={`width: ${score}%`} />
      </div>
    </div>
  )
}
