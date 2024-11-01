export const ThankYou = () => (
  <div
    class='centered'
    hx-get='/start'
    hx-trigger='load delay:5s'
    hx-target='#result'
    hx-swap='innerHTML'
  >
    <h2>Thank you for your time!</h2>
    <p style='width: 80%; text-align: center'>
      Your feedback has been saved. Please check your inbox for instructions on
      how to collect your reward! <br />
      <br />
      Head on over to the Payman AI stand to see the analysis of all the
      feedback.
    </p>
    <button
      type='submit'
      hx-get='/start'
      hx-target='#result'
      hx-swap='innerHTML'
      hx-trigger='click'
    >
      Done
    </button>
  </div>
)
