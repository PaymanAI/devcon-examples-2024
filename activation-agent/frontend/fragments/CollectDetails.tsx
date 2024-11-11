export const CollectDetails = () => (
  <div class="w-full">
    <h1 class="mb-2.5 text-2xl font-bold">
      Get Paid by <span class="text-primary">AI</span>
    </h1>

    <p class="mb-6 text-gray-700 md:text-xl ">
      Enter your email and X handle, and we'll create a personalized tweet for
      you. Share it and get paid in USDC!
    </p>

    <form
      hx-post="/start"
      hx-target="#result"
      hx-swap="innerHTML"
      hx-ext="json-enc"
      class="flex flex-col gap-4"
    >
      <div class="flex flex-col">
        <label for="email" class="md:text-xl font-medium mb-2">
          Your Email:
        </label>
        <input
          id="email"
          name="email"
          required
          type="email"
          placeholder="Enter your email address..."
          class="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent md:text-xl"
        />
      </div>

      <div class="flex flex-col">
        <label for="twitter" class="md:text-xl font-medium mb-2">
          Handle on X:
        </label>
        <input
          id="twitter"
          name="twitter"
          required
          type="text"
          placeholder="Enter your twitter handle..."
          class="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent md:text-xl"
        />
      </div>

      <button
        type="submit"
        hx-indicator="#spinner"
        class="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <span class="hide-on-request md:text-xl">Submit</span>
        <svg
          id="spinner"
          class="htmx-indicator w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <title>Loading</title>
          <path
            fill="#000000"
            d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
            opacity="0.25"
          />
          <circle cx="12" cy="2.5" r="1.5" fill="#000000">
            <animateTransform
              attributeName="transform"
              dur="0.75s"
              repeatCount="indefinite"
              type="rotate"
              values="0 12 12;360 12 12"
            />
          </circle>
        </svg>
      </button>
    </form>
  </div>
);
