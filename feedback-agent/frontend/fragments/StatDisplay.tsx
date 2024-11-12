export const StatDisplay = ({
  title,
  stat,
}: {
  title: string
  stat: string
}) => (
  <div class='rounded-3xl bg-[#fff2dc] p-8 text-center'>
    <h2 class='mb-5 font-bold text-2xl text-[#ef6f1c]'>{title}</h2>
    <div class='mb-2 font-bold text-4xl'>{stat}</div>
  </div>
)
