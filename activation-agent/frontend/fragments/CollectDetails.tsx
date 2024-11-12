export const CollectDetails = () => (
  <div class='w-full'>
    <h1 class='mb-2.5 font-bold text-2xl'>
      Get Paid by <span class='text-primary'>AI</span>
    </h1>

    <p class='mb-6 text-gray-700 md:text-xl '>
      Enter your email and X handle, and we'll create a personalized tweet for
      you. Share it and get paid in USDC!
    </p>

    <form
      hx-post='/start'
      hx-target='#result'
      hx-swap='innerHTML'
      hx-ext='json-enc'
      class='flex flex-col gap-4'
    >
      <div class='flex flex-col'>
        <label for='email' class='mb-2 font-medium md:text-xl'>
          Your Email:
        </label>
        <input
          id='email'
          name='email'
          required={true}
          type='email'
          placeholder='Enter your email address...'
          class='mb-4 w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary md:text-xl'
        />
      </div>

      <div class='flex flex-col'>
        <label for='twitter' class='mb-2 font-medium md:text-xl'>
          Handle on X:
        </label>
        <input
          id='twitter'
          name='twitter'
          required={true}
          type='text'
          placeholder='Enter your twitter handle...'
          class='mb-4 w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary md:text-xl'
        />
      </div>

      <button
        type='submit'
        hx-indicator='#spinner'
        class='flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-white transition-colors duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
      >
        <span class='hide-on-request md:text-xl'>Submit</span>
        <svg
          id='spinner'
          class='htmx-indicator h-4 w-4'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
        >
          <title>Loading</title>
          <path
            fill='#000000'
            d='M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z'
            opacity='0.25'
          />
          <circle cx='12' cy='2.5' r='1.5' fill='#000000'>
            <animateTransform
              attributeName='transform'
              dur='0.75s'
              repeatCount='indefinite'
              type='rotate'
              values='0 12 12;360 12 12'
            />
          </circle>
        </svg>
      </button>
    </form>
  </div>
)
