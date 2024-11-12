export const DistributionDisplay = ({
  title,
  score,
  positive,
  negative,
}: {
  title: string
  score: number
  positive: string
  negative: string
}) => {
  return (
    <div class='rounded-3xl border-4 border-[#040201] bg-[#fff2dc] p-8 text-center'>
      <h2 class='mb-5 font-bold text-2xl text-[#040201]'>{title}</h2>

      <div class='flex justify-between px-2.5 pb-0.5 font-bold'>
        <span class='text-red-600'>{negative}</span>
        <span class='text-green-600'>{positive}</span>
      </div>

      <div class='h-5 rounded-lg bg-gradient-to-r from-red-500 via-green-500 to-green-500'>
        <span
          class='mt-[-3px] inline-block h-[26px] border-gray-700 border-r-4'
          style={`width: ${score}%`}
        />
      </div>
    </div>
  )
}
