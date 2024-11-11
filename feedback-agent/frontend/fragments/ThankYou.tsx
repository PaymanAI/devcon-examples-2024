export const ThankYou = () => (
  <div
    class="flex flex-col justify-center items-center gap-5"
    hx-get="/start"
    hx-trigger="load delay:5s"
    hx-target="#result"
    hx-swap="innerHTML"
  >
    <h2 class="text-2xl font-bold text-center">Thank you for your time!</h2>
    <p class="w-4/5 text-center">
      Your feedback has been saved. Please check your inbox for instructions on
      how to collect your reward!
      <br />
      <br />
      Head on over to the Payman AI stand to see the analysis of all the
      feedback.
    </p>
    <button
      type="submit"
      hx-get="/start"
      hx-target="#result"
      hx-swap="innerHTML"
      hx-trigger="click"
      class="px-3 py-2 text-base text-white bg-[#ef6f1c] rounded-md cursor-pointer hover:bg-[#ff7d61] transition-colors duration-300"
    >
      Done
    </button>
  </div>
);
