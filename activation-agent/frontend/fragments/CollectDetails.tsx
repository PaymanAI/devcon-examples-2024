export const CollectDetails = () => (
  <div>
    <h1 style='margin-bottom: 10px'>
      Get Paid by <span style='color: #EF6F1C'>AI</span>
    </h1>
    <p style='margin-bottom: 25px'>
      Enter your email and X handle, and we'll create a personalized tweet for
      you. Share it and get paid in USDC!
    </p>
    <form
      hx-post='/start'
      hx-target='#result'
      hx-swap='innerHTML'
      hx-ext='json-enc'
    >
      <label for='email' style='font-size: 16px'>
        Your Email:
      </label>
      <input
        id='email'
        name='email'
        required={true}
        type='email'
        class='spacer'
        placeholder='Enter your email address...'
      />
      <label for='twitter' style='font-size: 16px'>
        Handle on X:
      </label>
      <input
        id='twitter'
        name='twitter'
        required={true}
        type='twitter'
        class='spacer'
        placeholder='Enter your twitter handle...'
      />
      <button type='submit' hx-indicator='#spinner' class='submit-button'>
        <svg
          id='spinner'
          class='htmx-indicator'
          xmlns='http://www.w3.org/2000/svg'
          width='1em'
          height='1em'
          viewBox='0 0 24 24'
        >
          <title>Loading</title>
          <path
            fill='currentColor'
            d='M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z'
            opacity='0.25'
          />
          <circle cx='12' cy='2.5' r='1.5' fill='currentColor'>
            <animateTransform
              attributeName='transform'
              dur='0.75s'
              repeatCount='indefinite'
              type='rotate'
              values='0 12 12;360 12 12'
            />
          </circle>
        </svg>
        <span class='hide-on-request'>Submit</span>
      </button>
    </form>
  </div>
)
