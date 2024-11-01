type GatherFeedbackProps = {
  thread_id?: string
  user_request?: string
  feedback?: string
  email?: string
}

export const GatherFeedback = ({
  thread_id,
  user_request,
  feedback,
  email,
}: GatherFeedbackProps) => (
  <div>
    <h1>Provide feedback about DevCon 2024</h1>
    {/* <div class="instructions">
			<div>
				How was your experience today? Let us know by submitting your feedback
				below and our AI agent will send you some USDC as a thank you!
				<br />
				<br />
				Feel free to use the QR code if you prefer to complete the form on your
				own device.
			</div>
			<div>
				<img src="/qrcode" alt="QR Code" style="width: 200px;" />
			</div>
		</div> */}
    <form
      hx-post={thread_id ? `/thread/${thread_id}` : '/thread'}
      hx-target='#result'
      hx-swap='innerHTML'
      hx-ext='json-enc'
    >
      {!!user_request?.length && <div class='feedback'>{user_request}</div>}
      <label for='email'>Your Email:</label>
      <input
        id='email'
        name='email'
        required={true}
        type='email'
        value={email}
        class='spacer'
        placeholder='Enter your email address...'
      />
      <label for='feedback'>What do you think of the conference so far?</label>
      <textarea id='feedback' name='feedback' required={true} class='spacer'>
        {feedback}
      </textarea>
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
        Submit Feedback
      </button>
    </form>
  </div>
)
