export const StatDisplay = ({
  title,
  stat,
}: {
  title: string;
  stat: string;
}) => (
  <div class="p-8 text-center rounded-3xl bg-[#fff2dc]">
    <h2 class="text-2xl font-bold text-[#ef6f1c] mb-5">{title}</h2>
    <div class="text-4xl font-bold mb-2">{stat}</div>
  </div>
);
