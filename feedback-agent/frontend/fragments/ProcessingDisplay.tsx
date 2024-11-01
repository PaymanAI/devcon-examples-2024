export const ProcessingDisplay = ({ thread_id }: { thread_id: string }) => (
  <div
    class='centered'
    hx-get={`/thread/${thread_id}`}
    hx-target='#result'
    hx-swap='innerHTML'
    hx-trigger='load delay:4s'
  >
    <h2>Let me think about that...</h2>
    <svg
      style='width: 75px; height: 75px;'
      id='spinner'
      xmlns='http://www.w3.org/2000/svg'
      width='1em'
      height='1em'
      viewBox='0 0 24 24'
    >
      <title>Loading</title>
      <path
        fill='#ff7d61'
        d='M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z'
        opacity='0.25'
      />
      <circle cx='12' cy='2.5' r='1.5' fill='#ff7d61'>
        <animateTransform
          attributeName='transform'
          dur='1s'
          repeatCount='indefinite'
          type='rotate'
          values='0 12 12;360 12 12'
        />
      </circle>
    </svg>
    <p class='center'>
      I'm thinking about what you said, give me a second to gather my
      thoughts...
    </p>
  </div>
)
