export const DistributionDisplay = ({
  title,
  score,
  positive,
  negative,
}: {
  title: string;
  score: number;
  positive: string;
  negative: string;
}) => {
  return (
    <div class="p-8 text-center rounded-3xl border-4 border-[#040201] bg-[#fff2dc]">
      <h2 class="text-2xl font-bold text-[#040201] mb-5">{title}</h2>

      <div class="flex justify-between font-bold px-2.5 pb-0.5">
        <span class="text-red-600">{negative}</span>
        <span class="text-green-600">{positive}</span>
      </div>

      <div class="h-5 rounded-lg bg-gradient-to-r from-red-500 via-green-500 to-green-500">
        <span
          class="h-[26px] inline-block mt-[-3px] border-r-4 border-gray-700"
          style={`width: ${score}%`}
        />
      </div>
    </div>
  );
};
