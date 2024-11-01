export const AlreadySubmitted = () => (
  <div
    class='centered'
    hx-get='/start'
    hx-trigger='load delay:5s'
    hx-target='#result'
    hx-swap='innerHTML'
  >
    <h2>Sorry, only one submission allowed!</h2>
    <p style='width: 80%; text-align: center'>
      It looks like you've already submitted feedback and we appreciate it, but
      we're only allowing one submission per person.
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
