export const AlreadySubmitted = () => (
  <div
    class='flex flex-col items-center justify-center gap-5'
    hx-get='/start'
    hx-trigger='load delay:5s'
    hx-target='#result'
    hx-swap='innerHTML'
  >
    <h2 class='text-center font-bold text-2xl'>
      Sorry, only one submission allowed!
    </h2>

    <p class='w-4/5 text-center'>
      It looks like you've already submitted feedback and we appreciate it, but
      we're only allowing one submission per person.
    </p>

    <button
      type='submit'
      hx-get='/start'
      hx-target='#result'
      hx-swap='innerHTML'
      hx-trigger='click'
      class='cursor-pointer rounded-md bg-[#ef6f1c] px-3 py-2 text-base text-white transition-colors duration-300 hover:bg-[#ff7d61]'
    >
      Done
    </button>
  </div>
)
